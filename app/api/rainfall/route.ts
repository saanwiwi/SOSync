import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function parseCSV(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    const record: Record<string, string | number | null> = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim() ?? "";

      if (value === "" || value === "NA") {
        record[header] = null;
      } else if (header === "SUBDIVISION") {
        record[header] = value;
      } else {
        const numberValue = Number(value);

        record[header] = Number.isNaN(numberValue)
          ? value
          : numberValue;
      }
    });

    return record;
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const subdivision =
      searchParams.get("subdivision");

    const yearParam =
      searchParams.get("year");

    const filePath = path.join(
      process.cwd(),
      "data",
      "Sub_Division_IMD_2017.csv"
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          error: "IMD rainfall dataset not found.",
        },
        { status: 404 }
      );
    }

    const csv = fs.readFileSync(
      filePath,
      "utf-8"
    );

    let records = parseCSV(csv);

    // ======================================================
    // FILTER BY IMD SUBDIVISION
    // ======================================================

    if (subdivision) {
      const normalizedSubdivision =
        subdivision.trim().toUpperCase();

      records = records.filter(
        (record) =>
          String(
            record.SUBDIVISION ?? ""
          ).trim().toUpperCase() ===
          normalizedSubdivision
      );
    }

    // ======================================================
    // FILTER BY YEAR
    // ======================================================

    if (yearParam) {
      const year = Number(yearParam);

      if (!Number.isNaN(year)) {
        records = records.filter(
          (record) =>
            Number(record.YEAR) === year
        );
      }
    }

    // ======================================================
    // GET AVAILABLE SUBDIVISIONS
    // ======================================================

    const subdivisions = Array.from(
      new Set(
        parseCSV(csv)
          .map((record) =>
            String(
              record.SUBDIVISION ?? ""
            ).trim()
          )
          .filter(Boolean)
      )
    ).sort();

    // ======================================================
    // RESPONSE
    // ======================================================

    return NextResponse.json({
      success: true,

      source: {
        provider:
          "India Meteorological Department (IMD)",

        publisher:
          "Ministry of Earth Sciences, Government of India",

        dataset:
          "Sub Divisional Monthly Rainfall from 1901 to 2017",

        coverage:
          "1901-2017",

        granularity:
          "Meteorological subdivision",

        unit:
          "mm",
      },

      query: {
        subdivision:
          subdivision || null,

        year:
          yearParam
            ? Number(yearParam)
            : null,
      },

      availableSubdivisions:
        subdivisions,

      count:
        records.length,

      data:
        records,
    });
  } catch (error) {
    console.error(
      "Rainfall API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not load IMD rainfall dataset.",
      },
      { status: 500 }
    );
  }
}