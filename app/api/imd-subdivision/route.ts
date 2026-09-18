import { NextResponse } from "next/server";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import fs from "fs";
import path from "path";

type GeoJSONFeature = {
  type: "Feature";
  properties?: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const latitude = Number(
      searchParams.get("latitude")
    );

    const longitude = Number(
      searchParams.get("longitude")
    );

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Valid latitude and longitude are required.",
        },
        { status: 400 }
      );
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Latitude or longitude is outside the valid range.",
        },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "data",
      "imd_subdivisions_wgs84.json"
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Converted IMD subdivision boundary file was not found.",
        },
        { status: 404 }
      );
    }

    const file = fs.readFileSync(
      filePath,
      "utf-8"
    );

    const geojson =
      JSON.parse(file) as GeoJSONFeatureCollection;

    const locationPoint = point([
      longitude,
      latitude,
    ]);

    let matchedFeature:
      | GeoJSONFeature
      | null = null;

    for (const feature of geojson.features) {
      try {
        const polygonFeature = {
          type: "Feature" as const,
          properties:
            feature.properties ?? {},
          geometry: feature.geometry,
        };

        if (
          booleanPointInPolygon(
            locationPoint,
            polygonFeature as any
          )
        ) {
          matchedFeature = feature;
          break;
        }
      } catch (error) {
        console.warn(
          "Skipping invalid geometry:",
          error
        );
      }
    }

    if (!matchedFeature) {
      return NextResponse.json({
        success: true,
        found: false,
        message:
          "No IMD meteorological subdivision contains this location.",
        requestedLocation: {
          latitude,
          longitude,
        },
      });
    }

    const properties =
      matchedFeature.properties ?? {};

    const subdivision =
      properties.subdivisio ??
      properties.subdivision ??
      properties.SUBDIVISION ??
      properties.Subdivision ??
      properties.name ??
      properties.NAME ??
      null;

    return NextResponse.json({
      success: true,
      found: true,

      requestedLocation: {
        latitude,
        longitude,
      },

      subdivision,

      properties,
    });
  } catch (error) {
    console.error(
      "IMD subdivision lookup error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not determine the IMD meteorological subdivision.",
      },
      { status: 500 }
    );
  }
}