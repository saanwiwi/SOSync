"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Station = {
  station: string;
  river: string;
  basin: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  acquisitionTime: string;
  waterLevel: number | null;
};

type NepalStation = {
  name: string;
  river: string;
  latitude: number;
  longitude: number;
  waterLevelM: number;
  time: string;
};

type SelectedLocation = {
  name: string;
  flooded: boolean;
  route: string;
};

const CHENNAI: [number, number] = [80.2707, 13.0827];

const NEPAL_CENTER: [number, number] = [
  85.15,
  27.95,
];

/* =========================================================
   REAL HISTORICAL DHM OBSERVATIONS
   BHOTE KOSHI FLOOD - 26 AUG 2026
   ========================================================= */

const NEPAL_STATIONS: NepalStation[] = [
  {
    name: "Bhotekoshi at Rasuwagadi",
    river: "Bhote Koshi",
    latitude: 28.271297,
    longitude: 85.377649,
    waterLevelM: 1.62,
    time: "08:40",
  },
  {
    name: "Bhotekoshi at Syaphrubesi",
    river: "Bhote Koshi",
    latitude: 28.2405,
    longitude: 85.3505,
    waterLevelM: 3.804,
    time: "08:50",
  },
  {
    name: "Trishuli at Betrawati",
    river: "Trishuli",
    latitude: 27.97,
    longitude: 85.18,
    waterLevelM: 3.549,
    time: "09:20",
  },
  {
    name: "Devghat",
    river: "Narayani",
    latitude: 27.73,
    longitude: 84.43,
    waterLevelM: 6.57,
    time: "16:00",
  },
];

/*
 * Historical river corridor used for the digital-twin
 * propagation model.
 *
 * IMPORTANT:
 * These are simulation coordinates, NOT observed
 * flood-boundary coordinates.
 */

const NEPAL_FLOOD_PATH: [number, number][] = [
  [85.377649, 28.271297],
  [85.3505, 28.2405],
  [85.31, 28.20],
  [85.28, 28.15],
  [85.24, 28.10],
  [85.18, 27.97],
  [85.12, 27.91],
  [85.05, 27.87],
  [84.98, 27.82],
  [84.90, 27.78],
  [84.82, 27.75],
  [84.74, 27.73],
  [84.65, 27.72],
  [84.57, 27.72],
  [84.50, 27.72],
  [84.43, 27.73],
];

const SEARCH_LOCATIONS = [
  {
    name: "Chennai",
    country: "India",
    center: [80.2707, 13.0827] as [
      number,
      number
    ],
    zoom: 10,
  },
  {
    name: "Vellore",
    country: "India",
    center: [79.1325, 12.9165] as [
      number,
      number
    ],
    zoom: 11,
  },
  {
    name: "Mumbai",
    country: "India",
    center: [72.8777, 19.076] as [
      number,
      number
    ],
    zoom: 10,
  },
  {
    name: "Delhi",
    country: "India",
    center: [77.1025, 28.7041] as [
      number,
      number
    ],
    zoom: 10,
  },
  {
    name: "Kolkata",
    country: "India",
    center: [88.3639, 22.5726] as [
      number,
      number
    ],
    zoom: 10,
  },
  {
    name: "Bengaluru",
    country: "India",
    center: [77.5946, 12.9716] as [
      number,
      number
    ],
    zoom: 10,
  },
  {
    name: "Nepal",
    country: "Bhote Koshi event",
    center: NEPAL_CENTER,
    zoom: 9,
  },
];

export default function DigitalTwinMap() {
  const mapContainer =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<mapboxgl.Map | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const eventActiveRef =
    useRef(false);

  const progressRef =
    useRef(0);

  const [mapLoaded, setMapLoaded] =
    useState(false);

  const [cwcStations, setCwcStations] =
    useState<Station[]>([]);

  const [cwcLoading, setCwcLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [eventActive, setEventActive] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [selected, setSelected] =
    useState<SelectedLocation | null>(
      null
    );

  const [showWhy, setShowWhy] =
    useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState("India");

  /*
   * Keep refs synchronized with state.
   */

  useEffect(() => {
    eventActiveRef.current =
      eventActive;
  }, [eventActive]);

  useEffect(() => {
    progressRef.current =
      progress;
  }, [progress]);

  /* =========================================================
     MAP INITIALIZATION
     ========================================================= */

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const token =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      console.error(
        "NEXT_PUBLIC_MAPBOX_TOKEN is missing"
      );
      return;
    }

    mapboxgl.accessToken = token;

    /*
     * IMPORTANT:
     * The container is fixed and already has
     * 100vw x 100vh dimensions.
     */

    const activeMap =
      new mapboxgl.Map({
        container:
          mapContainer.current,

        style:
          "mapbox://styles/mapbox/satellite-streets-v12",

        center: CHENNAI,

        zoom: 9,

        pitch: 45,

        bearing: 0,

        antialias: true,
      });

    mapRef.current =
      activeMap;

    /*
     * Force Mapbox to calculate the correct
     * viewport after React/browser layout.
     */

    requestAnimationFrame(() => {
      activeMap.resize();
    });

    setTimeout(() => {
      activeMap.resize();
    }, 100);

    setTimeout(() => {
      activeMap.resize();
    }, 500);

    setTimeout(() => {
      activeMap.resize();
    }, 1200);

    activeMap.addControl(
      new mapboxgl.NavigationControl(),
      "bottom-right"
    );

    activeMap.on("load", () => {
      console.log(
        "OMNIGRID MAP LOADED"
      );

      activeMap.resize();

      setMapLoaded(true);
    });

    activeMap.on("error", (event) => {
      console.error(
        "MAPBOX ERROR:",
        event.error
      );
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current =
          null;
      }

      activeMap.remove();

      mapRef.current = null;

      setMapLoaded(false);
    };
  }, []);

  /* =========================================================
     REAL CWC DATA
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadCwc() {
      try {
        setCwcLoading(true);

        const response =
          await fetch(
            "/api/cwc",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `CWC API returned ${response.status}`
          );
        }

        const json =
          await response.json();

        const rows =
          Array.isArray(json?.data)
            ? json.data
            : Array.isArray(
                  json?.results
                )
              ? json.results
              : [];

        if (!cancelled) {
          setCwcStations(rows);
        }

        console.log(
          "CWC STATIONS:",
          rows.length
        );
      } catch (error) {
        console.error(
          "CWC ERROR:",
          error
        );

        if (!cancelled) {
          setCwcStations([]);
        }
      } finally {
        if (!cancelled) {
          setCwcLoading(false);
        }
      }
    }

    loadCwc();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     MAP LAYERS
     ========================================================= */

  useEffect(() => {
    const activeMap =
      mapRef.current;

    if (!activeMap || !mapLoaded) {
      return;
    }

    /*
     * TERRAIN
     */

    try {
      if (
        !activeMap.getSource(
          "omnigrid-terrain"
        )
      ) {
        activeMap.addSource(
          "omnigrid-terrain",
          {
            type: "raster-dem",
            url:
              "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          }
        );
      }

      activeMap.setTerrain({
        source:
          "omnigrid-terrain",
        exaggeration: 1.15,
      });
    } catch (error) {
      console.warn(
        "Terrain unavailable:",
        error
      );
    }

    /*
     * SKY
     */

    try {
      if (
        !activeMap.getLayer(
          "omnigrid-sky"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-sky",

          type: "sky",

          paint: {
            "sky-type":
              "atmosphere",

            "sky-atmosphere-sun":
              [0, 30],

            "sky-atmosphere-sun-intensity":
              8,
          },
        });
      }
    } catch (error) {
      console.warn(
        "Sky unavailable:",
        error
      );
    }

    /*
     * 3D BUILDINGS
     */

    try {
      if (
        !activeMap.getLayer(
          "omnigrid-buildings"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-buildings",

          source:
            "composite",

          "source-layer":
            "building",

          filter: [
            "==",
            "extrude",
            "true",
          ],

          type:
            "fill-extrusion",

          minzoom: 13,

          paint: {
            "fill-extrusion-color":
              "#172033",

            "fill-extrusion-height": [
              "coalesce",
              [
                "get",
                "height",
              ],
              10,
            ],

            "fill-extrusion-base": [
              "coalesce",
              [
                "get",
                "min_height",
              ],
              0,
            ],

            "fill-extrusion-opacity":
              0.72,
          },
        });
      }
    } catch (error) {
      console.warn(
        "3D buildings unavailable:",
        error
      );
    }

    /*
     * ======================================================
     * CWC REAL STATIONS
     * ======================================================
     */

    try {
      const validStations =
        cwcStations.filter(
          (station) =>
            Number.isFinite(
              Number(
                station.latitude
              )
            ) &&
            Number.isFinite(
              Number(
                station.longitude
              )
            )
        );

      const stationGeoJson = {
        type:
          "FeatureCollection",

        features:
          validStations.map(
            (station) => ({
              type: "Feature",

              properties: {
                station:
                  station.station,

                river:
                  station.river,

                basin:
                  station.basin,

                state:
                  station.state,

                district:
                  station.district,

                waterLevel:
                  station.waterLevel,

                acquisitionTime:
                  station.acquisitionTime,
              },

              geometry: {
                type: "Point",

                coordinates: [
                  Number(
                    station.longitude
                  ),
                  Number(
                    station.latitude
                  ),
                ],
              },
            })
          ),
      };

      const existingSource =
        activeMap.getSource(
          "omnigrid-cwc"
        ) as
          | mapboxgl.GeoJSONSource
          | undefined;

      if (!existingSource) {
        activeMap.addSource(
          "omnigrid-cwc",
          {
            type: "geojson",
            data:
              stationGeoJson as any,
          }
        );
      } else {
        existingSource.setData(
          stationGeoJson as any
        );
      }

      if (
        !activeMap.getLayer(
          "omnigrid-cwc"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-cwc",

          type: "circle",

          source:
            "omnigrid-cwc",

          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3,
              2.5,
              8,
              4,
              12,
              6,
            ],

            "circle-color":
              "#22d3ee",

            "circle-opacity":
              0.9,

            "circle-stroke-color":
              "#ffffff",

            "circle-stroke-width":
              1.2,
          },
        });
      }

      /*
       * CWC station click.
       */

      const cwcClickHandler =
        (
          event: mapboxgl.MapLayerMouseEvent
        ) => {
          const feature =
            event.features?.[0];

          if (!feature) {
            return;
          }

          const properties =
            feature.properties ||
            {};

          const level =
            properties.waterLevel !==
              undefined &&
            properties.waterLevel !==
              null &&
            properties.waterLevel !==
              ""
              ? `${properties.waterLevel} m`
              : "No reading";

          new mapboxgl.Popup({
            offset: 10,
            maxWidth:
              "280px",
          })
            .setLngLat(
              event.lngLat
            )
            .setHTML(`
              <div style="
                background:#07111d;
                color:white;
                padding:16px;
                border-radius:12px;
                min-width:230px;
                font-family:system-ui;
              ">
                <div style="
                  color:#22d3ee;
                  font-size:9px;
                  font-weight:800;
                  letter-spacing:2px;
                ">
                  OBSERVED • CWC
                </div>

                <div style="
                  margin-top:8px;
                  font-size:14px;
                  font-weight:900;
                ">
                  ${escapeHtml(
                    properties.station ||
                      "CWC Station"
                  )}
                </div>

                <div style="
                  margin-top:10px;
                  font-size:25px;
                  font-weight:900;
                ">
                  ${escapeHtml(
                    level
                  )}
                </div>

                <div style="
                  margin-top:7px;
                  color:#94a3b8;
                  font-size:9px;
                ">
                  ${escapeHtml(
                    properties.river ||
                      "River"
                  )}
                </div>

                <div style="
                  margin-top:4px;
                  color:#64748b;
                  font-size:8px;
                ">
                  ${escapeHtml(
                    properties.state ||
                      ""
                  )}
                </div>

                <div style="
                  margin-top:12px;
                  color:#64748b;
                  font-size:8px;
                ">
                  CENTRAL WATER COMMISSION
                </div>
              </div>
            `)
            .addTo(activeMap);
        };

      activeMap.on(
        "click",
        "omnigrid-cwc",
        cwcClickHandler
      );

      activeMap.on(
        "mouseenter",
        "omnigrid-cwc",
        () => {
          activeMap.getCanvas().style.cursor =
            "pointer";
        }
      );

      activeMap.on(
        "mouseleave",
        "omnigrid-cwc",
        () => {
          activeMap.getCanvas().style.cursor =
            "";
        }
      );
    } catch (error) {
      console.warn(
        "CWC layer unavailable:",
        error
      );
    }

    /*
     * ======================================================
     * NEPAL DHM OBSERVED STATIONS
     * ======================================================
     */

    try {
      const nepalGeoJson = {
        type:
          "FeatureCollection",

        features:
          NEPAL_STATIONS.map(
            (station) => ({
              type: "Feature",

              properties: {
                name:
                  station.name,

                river:
                  station.river,

                level:
                  station.waterLevelM,

                time:
                  station.time,

                status:
                  "OBSERVED",
              },

              geometry: {
                type: "Point",

                coordinates: [
                  station.longitude,
                  station.latitude,
                ],
              },
            })
          ),
      };

      const existingNepalSource =
        activeMap.getSource(
          "omnigrid-nepal"
        ) as
          | mapboxgl.GeoJSONSource
          | undefined;

      if (!existingNepalSource) {
        activeMap.addSource(
          "omnigrid-nepal",
          {
            type: "geojson",
            data:
              nepalGeoJson as any,
          }
        );
      } else {
        existingNepalSource.setData(
          nepalGeoJson as any
        );
      }

      if (
        !activeMap.getLayer(
          "omnigrid-nepal"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-nepal",

          type: "circle",

          source:
            "omnigrid-nepal",

          paint: {
            "circle-radius":
              7,

            "circle-color":
              "#a78bfa",

            "circle-opacity":
              0.95,

            "circle-stroke-color":
              "#ffffff",

            "circle-stroke-width":
              2,
          },
        });
      }

      const nepalClickHandler =
        (
          event: mapboxgl.MapLayerMouseEvent
        ) => {
          const feature =
            event.features?.[0];

          if (!feature) {
            return;
          }

          const properties =
            feature.properties ||
            {};

          new mapboxgl.Popup({
            offset: 10,
            maxWidth:
              "280px",
          })
            .setLngLat(
              event.lngLat
            )
            .setHTML(`
              <div style="
                background:#07111d;
                color:white;
                padding:16px;
                border-radius:12px;
                min-width:230px;
                font-family:system-ui;
              ">
                <div style="
                  color:#a78bfa;
                  font-size:9px;
                  font-weight:800;
                  letter-spacing:2px;
                ">
                  OBSERVED • DHM
                </div>

                <div style="
                  margin-top:8px;
                  font-size:14px;
                  font-weight:900;
                ">
                  ${escapeHtml(
                    properties.name ||
                      "DHM Station"
                  )}
                </div>

                <div style="
                  margin-top:10px;
                  font-size:25px;
                  font-weight:900;
                ">
                  ${escapeHtml(
                    `${properties.level} m`
                  )}
                </div>

                <div style="
                  margin-top:7px;
                  color:#94a3b8;
                  font-size:9px;
                ">
                  ${escapeHtml(
                    properties.river ||
                      ""
                  )}
                </div>

                <div style="
                  margin-top:4px;
                  color:#64748b;
                  font-size:8px;
                ">
                  ${escapeHtml(
                    properties.time ||
                      ""
                  )} • 26 AUG 2026
                </div>

                <div style="
                  margin-top:12px;
                  color:#64748b;
                  font-size:8px;
                ">
                  DEPARTMENT OF HYDROLOGY
                  AND METEOROLOGY
                </div>
              </div>
            `)
            .addTo(activeMap);
        };

      activeMap.on(
        "click",
        "omnigrid-nepal",
        nepalClickHandler
      );

      activeMap.on(
        "mouseenter",
        "omnigrid-nepal",
        () => {
          activeMap.getCanvas().style.cursor =
            "pointer";
        }
      );

      activeMap.on(
        "mouseleave",
        "omnigrid-nepal",
        () => {
          activeMap.getCanvas().style.cursor =
            "";
        }
      );
    } catch (error) {
      console.warn(
        "Nepal layer unavailable:",
        error
      );
    }

    /*
     * ======================================================
     * SIMULATED FLOOD AREA
     * ======================================================
     */

    try {
      const existingFloodSource =
        activeMap.getSource(
          "omnigrid-flood"
        ) as
          | mapboxgl.GeoJSONSource
          | undefined;

      if (!existingFloodSource) {
        activeMap.addSource(
          "omnigrid-flood",
          {
            type: "geojson",

            data: {
              type:
                "FeatureCollection",

              features: [],
            } as any,
          }
        );
      }

      if (
        !activeMap.getLayer(
          "omnigrid-flood"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-flood",

          type: "fill",

          source:
            "omnigrid-flood",

          paint: {
            "fill-color":
              "#168bd4",

            "fill-opacity":
              0.42,
          },
        });
      }

      if (
        !activeMap.getLayer(
          "omnigrid-flood-outline"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-flood-outline",

          type: "line",

          source:
            "omnigrid-flood",

          paint: {
            "line-color":
              "#67e8f9",

            "line-width":
              2,
          },
        });
      }
    } catch (error) {
      console.warn(
        "Flood layer unavailable:",
        error
      );
    }

    /*
     * ======================================================
     * SIMULATED FLOOD FRONT
     * ======================================================
     */

    try {
      const existingFrontSource =
        activeMap.getSource(
          "omnigrid-front"
        ) as
          | mapboxgl.GeoJSONSource
          | undefined;

      if (!existingFrontSource) {
        activeMap.addSource(
          "omnigrid-front",
          {
            type: "geojson",

            data: {
              type:
                "FeatureCollection",

              features: [],
            } as any,
          }
        );
      }

      if (
        !activeMap.getLayer(
          "omnigrid-front"
        )
      ) {
        activeMap.addLayer({
          id:
            "omnigrid-front",

          type: "circle",

          source:
            "omnigrid-front",

          paint: {
            "circle-radius":
              11,

            "circle-color":
              "#d9faff",

            "circle-opacity":
              0.95,

            "circle-stroke-color":
              "#ffffff",

            "circle-stroke-width":
              2,
          },
        });
      }
    } catch (error) {
      console.warn(
        "Flood front unavailable:",
        error
      );
    }

    /*
     * One more resize after all layers.
     */

    requestAnimationFrame(() => {
      activeMap.resize();
    });
  }, [
    mapLoaded,
    cwcStations,
  ]);

  /* =========================================================
     FLOOD SIMULATION
     ========================================================= */

  useEffect(() => {
    const activeMap =
      mapRef.current;

    if (!activeMap || !mapLoaded) {
      return;
    }

    const floodSource =
      activeMap.getSource(
        "omnigrid-flood"
      ) as
        | mapboxgl.GeoJSONSource
        | undefined;

    const frontSource =
      activeMap.getSource(
        "omnigrid-front"
      ) as
        | mapboxgl.GeoJSONSource
        | undefined;

    if (!floodSource || !frontSource) {
      return;
    }

    /*
     * FIX FOR THE TYPESCRIPT ERRORS:
     *
     * After the undefined check these are guaranteed
     * to be actual GeoJSON sources.
     */

    const safeFloodSource =
      floodSource;

    const safeFrontSource =
      frontSource;

    /*
     * Stop and clear simulation.
     */

    if (!eventActive) {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current =
          null;
      }

      safeFloodSource.setData({
        type:
          "FeatureCollection",

        features: [],
      } as any);

      safeFrontSource.setData({
        type:
          "FeatureCollection",

        features: [],
      } as any);

      return;
    }

    const start =
      performance.now();

    const duration =
      18000;

    function animate(
      now: number
    ) {
      const raw =
        (now - start) /
        duration;

      const currentProgress =
        Math.min(
          1,
          Math.max(
            0,
            raw
          )
        );

      progressRef.current =
        currentProgress;

      setProgress(
        currentProgress
      );

      /*
       * ====================================================
       * FLOOD FRONT
       * ====================================================
       */

      const scaled =
        currentProgress *
        (NEPAL_FLOOD_PATH.length -
          1);

      const segment =
        Math.min(
          Math.floor(
            scaled
          ),
          NEPAL_FLOOD_PATH.length -
            2
        );

      const fraction =
        scaled -
        segment;

      const first =
        NEPAL_FLOOD_PATH[
          segment
        ];

      const second =
        NEPAL_FLOOD_PATH[
          segment + 1
        ];

      const longitude =
        first[0] +
        (second[0] -
          first[0]) *
          fraction;

      const latitude =
        first[1] +
        (second[1] -
          first[1]) *
          fraction;

      safeFrontSource.setData({
        type:
          "FeatureCollection",

        features: [
          {
            type: "Feature",

            properties: {
              status:
                "SIMULATED",
            },

            geometry: {
              type: "Point",

              coordinates: [
                longitude,
                latitude,
              ],
            },
          },
        ],
      } as any);

      /*
       * ====================================================
       * FLOOD ENVELOPE
       * ====================================================
       */

      const visibleCount =
        Math.max(
          2,
          Math.floor(
            2 +
              currentProgress *
                (NEPAL_FLOOD_PATH.length -
                  2)
          )
        );

      const visiblePath =
        NEPAL_FLOOD_PATH.slice(
          0,
          visibleCount
        );

      const left: [
        number,
        number
      ][] = [];

      const right: [
        number,
        number
      ][] = [];

      visiblePath.forEach(
        (
          [x, y],
          index
        ) => {
          const previous =
            visiblePath[
              Math.max(
                0,
                index - 1
              )
            ];

          const next =
            visiblePath[
              Math.min(
                visiblePath.length -
                  1,
                index + 1
              )
            ];

          const dx =
            next[0] -
            previous[0];

          const dy =
            next[1] -
            previous[1];

          const length =
            Math.sqrt(
              dx * dx +
                dy * dy
            ) || 1;

          const normalX =
            -dy /
            length;

          const normalY =
            dx /
            length;

          /*
           * Width expands as the simulation
           * propagates.
           */

          const width =
            0.004 +
            currentProgress *
              0.014;

          left.push([
            x +
              normalX *
                width,

            y +
              normalY *
                width,
          ]);

          right.push([
            x -
              normalX *
                width,

            y -
              normalY *
                width,
          ]);
        }
      );

      if (left.length >= 2) {
        safeFloodSource.setData({
          type:
            "FeatureCollection",

          features: [
            {
              type: "Feature",

              properties: {
                status:
                  "SIMULATED",

                model:
                  "Historical river-corridor propagation",
              },

              geometry: {
                type: "Polygon",

                coordinates: [
                  [
                    ...left,

                    ...right.reverse(),

                    left[0],
                  ],
                ],
              },
            },
          ],
        } as any);
      }

      /*
       * Continue animation.
       */

      if (
        currentProgress < 1
      ) {
        animationRef.current =
          requestAnimationFrame(
            animate
          );
      } else {
        animationRef.current =
          null;
      }
    }

    animationRef.current =
      requestAnimationFrame(
        animate
      );

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current =
          null;
      }
    };
  }, [
    eventActive,
    mapLoaded,
  ]);

  /* =========================================================
     MAP CLICK
     ========================================================= */

  useEffect(() => {
    const activeMap =
      mapRef.current;

    if (!activeMap || !mapLoaded) {
      return;
    }

    const handleMapClick =
      (
        event: mapboxgl.MapMouseEvent
      ) => {
        if (
          !eventActiveRef.current
        ) {
          return;
        }

        const layers: string[] =
          [];

        if (
          activeMap.getLayer(
            "omnigrid-cwc"
          )
        ) {
          layers.push(
            "omnigrid-cwc"
          );
        }

        if (
          activeMap.getLayer(
            "omnigrid-nepal"
          )
        ) {
          layers.push(
            "omnigrid-nepal"
          );
        }

        if (layers.length > 0) {
          const stationHits =
            activeMap.queryRenderedFeatures(
              event.point,
              {
                layers,
              }
            );

          if (
            stationHits.length >
            0
          ) {
            return;
          }
        }

        const result =
          classifyLocation(
            event.lngLat.lng,
            event.lngLat.lat,
            progressRef.current
          );

        setSelected({
          name:
            result.name,

          flooded:
            result.flooded,

          route:
            result.flooded
              ? "AVOID ROUTE"
              : "ROUTE CLEAR",
        });

        setShowWhy(
          false
        );
      };

    activeMap.on(
      "click",
      handleMapClick
    );

    return () => {
      activeMap.off(
        "click",
        handleMapClick
      );
    };
  }, [mapLoaded]);

  /* =========================================================
     SEARCH
     ========================================================= */

  function performSearch() {
    const query =
      search
        .trim()
        .toLowerCase();

    if (!query) {
      return;
    }

    const location =
      SEARCH_LOCATIONS.find(
        (item) =>
          item.name
            .toLowerCase()
            .includes(query) ||
          item.country
            .toLowerCase()
            .includes(query)
      );

    if (!location) {
      setSelectedLocation(
        "Location not found"
      );

      return;
    }

    const activeMap =
      mapRef.current;

    if (!activeMap) {
      return;
    }

    setSelectedLocation(
      location.name
    );

    activeMap.flyTo({
      center:
        location.center,

      zoom:
        location.zoom,

      pitch:
        location.name ===
        "Nepal"
          ? 55
          : 45,

      bearing:
        location.name ===
        "Nepal"
          ? -15
          : 0,

      duration: 1800,
    });

    if (
      location.name ===
      "Nepal"
    ) {
      setTimeout(() => {
        startNepalReplay();
      }, 1200);
    }
  }

  /* =========================================================
     START NEPAL REPLAY
     ========================================================= */

  function startNepalReplay() {
    const activeMap =
      mapRef.current;

    if (!activeMap) {
      return;
    }

    setSelectedLocation(
      "Bhote Koshi / Trishuli"
    );

    setSelected(null);

    setShowWhy(false);

    setProgress(0);

    progressRef.current =
      0;

    eventActiveRef.current =
      true;

    setEventActive(
      true
    );

    activeMap.flyTo({
      center:
        NEPAL_CENTER,

      zoom: 9.4,

      pitch: 55,

      bearing: -15,

      duration: 1500,
    });
  }

  /* =========================================================
     RESET
     ========================================================= */

  function resetMap() {
    const activeMap =
      mapRef.current;

    eventActiveRef.current =
      false;

    setEventActive(
      false
    );

    setProgress(0);

    progressRef.current =
      0;

    setSelected(null);

    setShowWhy(false);

    setSelectedLocation(
      "India"
    );

    if (activeMap) {
      activeMap.flyTo({
        center:
          CHENNAI,

        zoom: 9,

        pitch: 45,

        bearing: 0,

        duration: 1400,
      });
    }
  }

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div
      className="relative overflow-hidden bg-[#020617] text-white"
      style={{
        position:
          "fixed",
        inset: 0,
        width:
          "100vw",
        height:
          "100vh",
      }}
    >

      {/* ===================================================
          MAP CONTAINER
          =================================================== */}

      <div
        ref={mapContainer}
        style={{
          position:
            "fixed",

          inset: 0,

          width:
            "100vw",

          height:
            "100vh",

          minWidth:
            "100vw",

          minHeight:
            "100vh",

          zIndex: 0,
        }}
      />

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="pointer-events-none absolute left-4 right-4 top-4 z-30 flex items-start justify-between gap-4">

        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#050b14]/90 px-5 py-4 backdrop-blur-xl">

          <div className="flex items-center gap-4">

            <div className="text-2xl text-cyan-300">
              ◈
            </div>

            <div>

              <div className="text-sm font-black tracking-[0.32em]">
                OMNIGRID
              </div>

              <div className="mt-1 text-[8px] font-bold tracking-[0.2em] text-slate-500">
                EDGE-NATIVE DISASTER RESPONSE
              </div>

            </div>

            <div className="h-7 w-px bg-white/10" />

            <div className="text-[8px] font-black tracking-[0.22em] text-cyan-300">
              DIGITAL TWIN
            </div>

          </div>

        </div>

        <div className="pointer-events-auto flex gap-2">

          <div className="rounded-xl border border-cyan-400/20 bg-[#050b14]/90 px-4 py-3 backdrop-blur-xl">

            <div className="text-[7px] tracking-widest text-slate-500">
              CWC TELEMETRY
            </div>

            <div className="mt-1 text-sm font-black text-cyan-300">
              {cwcLoading
                ? "..."
                : cwcStations.length}
            </div>

            <div className="text-[7px] text-slate-500">
              STATIONS
            </div>

          </div>

          <div className="rounded-xl border border-emerald-400/20 bg-[#050b14]/90 px-4 py-3 backdrop-blur-xl">

            <div className="text-[7px] tracking-widest text-slate-500">
              SYSTEM
            </div>

            <div className="mt-1 text-[9px] font-black text-emerald-300">
              ● ONLINE
            </div>

            <div className="text-[7px] text-slate-500">
              DIGITAL TWIN READY
            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          SEARCH
          =================================================== */}

      <div className="absolute left-1/2 top-24 z-30 w-[360px] -translate-x-1/2">

        <div className="flex overflow-hidden rounded-xl border border-white/10 bg-[#050b14]/95 backdrop-blur-xl">

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                performSearch();
              }
            }}
            placeholder="Search city or region..."
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xs text-white outline-none placeholder:text-slate-600"
          />

          <button
            onClick={
              performSearch
            }
            className="px-4 text-[9px] font-black tracking-widest text-cyan-300 hover:bg-cyan-400/10"
          >
            SEARCH
          </button>

        </div>

      </div>

      {/* ===================================================
          LEFT PANEL
          =================================================== */}

      <div className="absolute bottom-5 left-4 top-40 z-20 w-[305px] overflow-y-auto rounded-2xl border border-white/10 bg-[#050b14]/90 p-4 backdrop-blur-xl">

        <div className="text-[8px] font-black tracking-[0.25em] text-cyan-300">
          SITUATIONAL AWARENESS
        </div>

        <div className="mt-1 text-xl font-black">
          {selectedLocation}
        </div>

        <div className="mt-1 text-[9px] leading-relaxed text-slate-500">
          Real hydrological observations
          powering the OmniGrid digital
          twin.
        </div>

        {/* REAL CWC DATA */}

        <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3">

          <div className="flex items-center justify-between">

            <div className="text-[8px] font-black tracking-widest text-cyan-300">
              LIVE TELEMETRY
            </div>

            <div className="text-[7px] font-bold text-emerald-300">
              CWC
            </div>

          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">

            <div>

              <div className="text-[7px] text-slate-600">
                SOURCE
              </div>

              <div className="mt-1 text-[8px] font-bold">
                Central Water Commission
              </div>

            </div>

            <div>

              <div className="text-[7px] text-slate-600">
                DATA
              </div>

              <div className="mt-1 text-[8px] font-bold">
                Hourly Water Level
              </div>

            </div>

          </div>

        </div>

        {/* HISTORICAL REPLAY */}

        <button
          onClick={
            startNepalReplay
          }
          className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-left hover:bg-red-500/15"
        >

          <div className="text-[8px] font-black tracking-widest text-red-300">
            HISTORICAL REPLAY
          </div>

          <div className="mt-2 text-sm font-black">
            Bhote Koshi Flood
          </div>

          <div className="mt-1 text-[9px] text-slate-500">
            Nepal • 26 AUG 2026
          </div>

          <div className="mt-3 text-[8px] font-black tracking-widest text-red-300">
            START DIGITAL TWIN →
          </div>

        </button>

        {/* SIMULATION PROGRESS */}

        {eventActive && (
          <div className="mt-3 rounded-xl border border-blue-400/20 bg-blue-500/5 p-3">

            <div className="flex justify-between">

              <span className="text-[8px] font-black tracking-widest text-blue-300">
                FLOOD FRONT
              </span>

              <span className="text-[9px] font-black">
                {Math.round(
                  progress *
                    100
                )}
                %
              </span>

            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-blue-400"
                style={{
                  width: `${
                    progress *
                    100
                  }%`,
                }}
              />

            </div>

            <div className="mt-2 text-[7px] tracking-widest text-slate-500">
              SIMULATED DOWNSTREAM PROPAGATION
            </div>

          </div>
        )}

        {/* OBSERVED DHM DATA */}

        {eventActive && (
          <div className="mt-3 rounded-xl border border-purple-400/20 bg-purple-500/5 p-3">

            <div className="text-[8px] font-black tracking-widest text-purple-300">
              OBSERVED DHM DATA
            </div>

            <div className="mt-3 space-y-3">

              {NEPAL_STATIONS.map(
                (station) => (
                  <div
                    key={
                      station.name
                    }
                    className="flex items-center justify-between"
                  >

                    <div className="min-w-0 pr-3">

                      <div className="truncate text-[8px] font-bold">
                        {
                          station.name
                        }
                      </div>

                      <div className="mt-1 text-[7px] text-slate-600">
                        {
                          station.time
                        }
                      </div>

                    </div>

                    <div className="text-[10px] font-black text-purple-300">
                      {
                        station.waterLevelM
                      }
                      m
                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* DATA PROVENANCE */}

        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">

          <div className="text-[8px] font-black tracking-widest text-slate-400">
            DATA PROVENANCE
          </div>

          <div className="mt-3 space-y-3 text-[8px] leading-relaxed text-slate-500">

            <div>
              <span className="font-bold text-cyan-300">
                INDIA
              </span>
              {" "}
              Central Water Commission
              National Water Data Portal
            </div>

            <div>
              <span className="font-bold text-purple-300">
                NEPAL
              </span>
              {" "}
              Department of Hydrology
              and Meteorology
            </div>

            <div>
              <span className="font-bold text-blue-300">
                OUTPUT
              </span>
              {" "}
              OmniGrid digital twin
              simulation
            </div>

          </div>

        </div>

        <button
          onClick={
            resetMap
          }
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 text-[8px] font-black tracking-widest text-slate-400 hover:bg-white/[0.06]"
        >
          RESET MAP
        </button>

      </div>

      {/* ===================================================
          RIGHT PANEL
          =================================================== */}

      <div className="absolute bottom-5 right-4 top-40 z-20 w-[305px] overflow-y-auto rounded-2xl border border-white/10 bg-[#050b14]/90 p-4 backdrop-blur-xl">

        {!showWhy ? (
          <>

            <div className="text-[8px] font-black tracking-[0.25em] text-cyan-300">
              DIGITAL TWIN
            </div>

            <div className="mt-1 text-lg font-black">
              Flood Intelligence
            </div>

            <div className="mt-5 space-y-2">

              <InfoCard
                label="OBSERVATION"
                value="REAL TELEMETRY"
                detail="CWC / DHM"
                accent="cyan"
              />

              <InfoCard
                label="HISTORICAL EVENT"
                value="26 AUG 2026"
                detail="Bhote Koshi Flood"
                accent="purple"
              />

              <InfoCard
                label="SIMULATION"
                value={
                  eventActive
                    ? "RUNNING"
                    : "READY"
                }
                detail="Downstream propagation"
                accent="blue"
              />

            </div>

            {selected && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">

                <div className="text-[8px] font-black tracking-widest text-cyan-300">
                  LOCATION ASSESSMENT
                </div>

                <div className="mt-2 text-sm font-black">
                  {
                    selected.name
                  }
                </div>

                <div className="mt-4 flex justify-between">

                  <span className="text-[8px] text-slate-500">
                    FLOOD STATUS
                  </span>

                  <span
                    className={
                      selected.flooded
                        ? "text-[8px] font-black text-red-300"
                        : "text-[8px] font-black text-emerald-300"
                    }
                  >
                    {selected.flooded
                      ? "FLOODED"
                      : "NOT FLOODED"}
                  </span>

                </div>

                <div className="mt-3 flex justify-between">

                  <span className="text-[8px] text-slate-500">
                    ROUTE STATUS
                  </span>

                  <span
                    className={
                      selected.flooded
                        ? "text-[8px] font-black text-orange-300"
                        : "text-[8px] font-black text-cyan-300"
                    }
                  >
                    {
                      selected.route
                    }
                  </span>

                </div>

                <button
                  onClick={() =>
                    setShowWhy(
                      true
                    )
                  }
                  className="mt-5 w-full rounded-lg border border-cyan-400/20 bg-cyan-400/10 py-3 text-[8px] font-black tracking-widest text-cyan-300"
                >
                  WHY THIS RESULT →
                </button>

              </div>
            )}

            {!selected && (
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-4">

                <div className="text-[8px] font-black tracking-widest text-slate-400">
                  INTERACT WITH THE TWIN
                </div>

                <div className="mt-3 text-[9px] leading-relaxed text-slate-500">
                  Start the Nepal historical
                  replay and click a location
                  on the map to assess its
                  simulated flood state.
                </div>

              </div>
            )}

            <div className="mt-5">

              <div className="text-[8px] font-black tracking-widest text-slate-500">
                MAP LEGEND
              </div>

              <div className="mt-3 space-y-2">

                <Legend
                  dot="bg-cyan-300"
                  label="CWC OBSERVED"
                />

                <Legend
                  dot="bg-purple-400"
                  label="DHM OBSERVED"
                />

                <Legend
                  dot="bg-blue-400"
                  label="SIMULATED FLOOD"
                />

                <Legend
                  dot="bg-white"
                  label="SIMULATED FLOOD FRONT"
                />

              </div>

            </div>

          </>
        ) : (
          <>

            <button
              onClick={() =>
                setShowWhy(
                  false
                )
              }
              className="text-[8px] font-black tracking-widest text-slate-500"
            >
              ← BACK
            </button>

            <div className="mt-5 text-[8px] font-black tracking-[0.25em] text-cyan-300">
              MODEL TRANSPARENCY
            </div>

            <div className="mt-1 text-lg font-black">
              Why this result?
            </div>

            <div className="mt-5 space-y-3">

              <ModelStep
                number="01"
                title="OBSERVE"
                text="OmniGrid uses observed river-level measurements from official hydrological monitoring systems."
              />

              <ModelStep
                number="02"
                title="CORRELATE"
                text="Observed stations are positioned along the upstream-to-downstream river corridor using their geographic locations and historical timestamps."
              />

              <ModelStep
                number="03"
                title="PROPAGATE"
                text="The digital twin propagates the historical flood signal downstream through the mapped river corridor."
              />

              <ModelStep
                number="04"
                title="SIMULATE"
                text="A dynamic flood envelope expands around the river corridor while the simulated flood front moves downstream."
              />

              <ModelStep
                number="05"
                title="ASSESS"
                text="The clicked location is classified against the current simulated extent."
              />

            </div>

            <div className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">

              <div className="text-[8px] font-black tracking-widest text-yellow-300">
                OBSERVED ≠ SIMULATED
              </div>

              <div className="mt-2 text-[8px] leading-relaxed text-slate-500">
                DHM station measurements are
                observed historical data.
                The blue boundary is a
                simulation generated by
                OmniGrid. It is not being
                presented as satellite-observed
                flood extent.
              </div>

            </div>

          </>
        )}

      </div>

      {/* ===================================================
          BOTTOM STATUS
          =================================================== */}

      {eventActive && (
        <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-white/10 bg-black/75 px-5 py-3 backdrop-blur-xl">

          <div className="flex items-center gap-5">

            <div>

              <div className="text-[7px] tracking-widest text-slate-500">
                HISTORICAL REPLAY
              </div>

              <div className="text-[10px] font-black">
                26 AUG 2026
              </div>

            </div>

            <div className="h-6 w-px bg-white/10" />

            <div>

              <div className="text-[7px] tracking-widest text-slate-500">
                OUTPUT
              </div>

              <div className="text-[9px] font-black text-blue-300">
                SIMULATED
              </div>

            </div>

            <div className="h-6 w-px bg-white/10" />

            <div>

              <div className="text-[7px] tracking-widest text-slate-500">
                FRONT
              </div>

              <div className="text-[9px] font-black text-cyan-300">
                {Math.round(
                  progress *
                    100
                )}
                %
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================
          LOADING
          =================================================== */}

      {!mapLoaded && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-[#020617]">

          <div className="rounded-xl border border-white/10 bg-[#050b14]/95 px-8 py-5 backdrop-blur-xl">

            <div className="text-center">

              <div className="text-sm font-black tracking-[0.3em] text-cyan-300">
                OMNIGRID
              </div>

              <div className="mt-2 text-[8px] tracking-widest text-slate-500">
                INITIALIZING DIGITAL TWIN...
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ============================================================
   UI COMPONENTS
   ============================================================ */

function InfoCard({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent:
    | "cyan"
    | "purple"
    | "blue";
}) {
  const accentClass =
    accent === "cyan"
      ? "text-cyan-300"
      : accent === "purple"
        ? "text-purple-300"
        : "text-blue-300";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">

      <div className="text-[7px] font-black tracking-widest text-slate-600">
        {label}
      </div>

      <div
        className={`mt-2 text-[10px] font-black ${accentClass}`}
      >
        {value}
      </div>

      <div className="mt-1 text-[8px] text-slate-500">
        {detail}
      </div>

    </div>
  );
}

function Legend({
  dot,
  label,
}: {
  dot: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2 w-2 rounded-full ${dot}`}
      />

      <span className="text-[8px] text-slate-500">
        {label}
      </span>

    </div>
  );
}

function ModelStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">

      <div className="flex items-center gap-3">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-[8px] font-black text-cyan-300">
          {number}
        </div>

        <div className="text-[8px] font-black tracking-widest">
          {title}
        </div>

      </div>

      <div className="mt-3 text-[8px] leading-relaxed text-slate-500">
        {text}
      </div>

    </div>
  );
}

/* ============================================================
   LOCATION CLASSIFICATION
   ============================================================ */

function classifyLocation(
  longitude: number,
  latitude: number,
  progress: number
) {
  let nearestDistance =
    Infinity;

  let nearestIndex =
    0;

  NEPAL_FLOOD_PATH.forEach(
    (
      [lng, lat],
      index
    ) => {
      const dx =
        (longitude - lng) *
        90;

      const dy =
        (latitude - lat) *
        111;

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy
        );

      if (
        distance <
        nearestDistance
      ) {
        nearestDistance =
          distance;

        nearestIndex =
          index;
      }
    }
  );

  const currentIndex =
    progress *
    (NEPAL_FLOOD_PATH.length -
      1);

  const flooded =
    nearestDistance <
      2.5 &&
    nearestIndex <=
      currentIndex;

  return {
    name: flooded
      ? "Simulated flood zone"
      : "Selected location",

    flooded,
  };
}

/* ============================================================
   HTML ESCAPING FOR MAPBOX POPUPS
   ============================================================ */

function escapeHtml(
  value: unknown
) {
  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}