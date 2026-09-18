import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import readline from "readline";

const RIVERS = [
  "krishna.csv",
  "cauvery.csv",
  "godavari.csv",
  "mahanadi.csv",
  "pennar.csv",
];

type StationData = {
  station: string;
  river: string;
  basin: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  acquisitionTime: string;
  waterLevel: number;
  sourceFile: string;
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result.map((value) =>
    value.replace(/^"|"$/g, "").trim()
  );
}

async function readLatestStations(
  filename: string
): Promise<StationData[]> {
  const filePath = path.join(
    process.cwd(),
    "data",
    "india",
    filename
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const stream = fs.createReadStream(filePath, {
    encoding: "utf8",
  });

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let headers: string[] = [];

  const latest = new Map<string, StationData>();

  for await (const line of rl) {
    if (!line.trim()) continue;

    if (headers.length === 0) {
      headers = parseCSVLine(line);
      continue;
    }

    const values = parseCSVLine(line);

    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    const station = row["Station"] ?? "";
    const river = row["River"] ?? "";

    const latitude = Number(row["Latitude"]);
    const longitude = Number(row["Longitude"]);

    const waterLevel = Number(
      row[
        "River Water Level Telemetry Hourly (meter)"
      ]
    );

    const acquisitionTime =
      row["Data Acquisition Time"] ?? "";

    if (
      !station ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(waterLevel) ||
      !acquisitionTime
    ) {
      continue;
    }

    const key =
      `${station}|${river}|${latitude}|${longitude}`;

    const existing = latest.get(key);

    /*
     * CWC timestamps are DD-MM-YYYY HH:mm.
     */
    const parseDate = (value: string) => {
      const match = value.match(
        /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/
      );

      if (!match) return 0;

      const [, day, month, year, hour, minute] =
        match;

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      ).getTime();
    };

    if (
      !existing ||
      parseDate(acquisitionTime) >
        parseDate(existing.acquisitionTime)
    ) {
      latest.set(key, {
        station,
        river,
        basin: row["Basin"] ?? "",
        state: row["State"] ?? "",
        district: row["District"] ?? "",
        latitude,
        longitude,
        acquisitionTime,
        waterLevel,
        sourceFile: filename,
      });
    }
  }

  return Array.from(latest.values());
}

export async function GET() {
  try {
    const allStations: StationData[] = [];

    for (const filename of RIVERS) {
      const stations =
        await readLatestStations(filename);

      allStations.push(...stations);
    }

    return NextResponse.json({
      success: true,
      source:
        "Central Water Commission, Government of India",
      dataset:
        "River Water Level Telemetry Hourly",
      count: allStations.length,
      data: allStations,
    });
  } catch (error) {
    console.warn("CWC API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
        data: [],
      },
      { status: 500 }
    );
  }
}