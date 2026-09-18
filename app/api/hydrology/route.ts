import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const latitude = Number(searchParams.get("latitude"));
    const longitude = Number(searchParams.get("longitude"));

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid latitude and longitude are required.",
        },
        { status: 400 }
      );
    }

    const startDate =
      searchParams.get("start_date") || "2018-01-01";

    const endDate =
      searchParams.get("end_date") || "2022-07-31";

    const url =
      "https://flood-api.open-meteo.com/v1/flood" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&start_date=${startDate}` +
      `&end_date=${endDate}` +
      "&daily=river_discharge" +
      "&cell_selection=nearest";

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Open-Meteo Flood API error:", errorText);

      return NextResponse.json(
        {
          success: false,
          error: "Hydrological data provider returned an error.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      source: {
        provider: "Open-Meteo",
        underlyingDataset: "GloFAS v4",
        dataType: "Historical hydrological reanalysis",
        variable: "River discharge",
        unit: "m³/s",
        historicalCoverage: "1984-01-01 to 2022-07-31",
      },
      requestedLocation: {
        latitude,
        longitude,
      },
      data,
    });
  } catch (error) {
    console.error("Hydrology API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load hydrological data.",
      },
      { status: 500 }
    );
  }
}