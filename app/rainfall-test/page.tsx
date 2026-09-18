"use client";

import { useEffect, useState } from "react";

type RainfallRecord = {
  SUBDIVISION: string;
  YEAR: number;
  JAN: number | null;
  FEB: number | null;
  MAR: number | null;
  APR: number | null;
  MAY: number | null;
  JUN: number | null;
  JUL: number | null;
  AUG: number | null;
  SEP: number | null;
  OCT: number | null;
  NOV: number | null;
  DEC: number | null;
  ANNUAL: number | null;
  JF: number | null;
  MAM: number | null;
  JJAS: number | null;
  OND: number | null;
};

export default function RainfallTestPage() {
  const [data, setData] = useState<RainfallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRainfall() {
      try {
        const response = await fetch("/api/rainfall");

        if (!response.ok) {
          throw new Error("Failed to fetch rainfall data");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Could not load rainfall data");
        }

        setData(result.data);
      } catch (err) {
        console.error(err);
        setError("Could not load rainfall data.");
      } finally {
        setLoading(false);
      }
    }

    loadRainfall();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">Loading historical rainfall data...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">
        Historical Rainfall Dataset
      </h1>

      <p className="text-slate-400 mb-8">
        Real IMD sub-divisional rainfall observations
      </p>

      <div className="bg-slate-900 rounded-xl p-6 mb-8">
        <p className="text-slate-400 text-sm">Total records</p>
        <p className="text-3xl font-bold">{data.length}</p>
      </div>

      <div className="overflow-x-auto bg-slate-900 rounded-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-left">
              <th className="p-4">Subdivision</th>
              <th className="p-4">Year</th>
              <th className="p-4">Annual Rainfall</th>
              <th className="p-4">JJAS</th>
              <th className="p-4">MAM</th>
              <th className="p-4">OND</th>
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 20).map((record, index) => (
              <tr
                key={`${record.SUBDIVISION}-${record.YEAR}-${index}`}
                className="border-b border-slate-800"
              >
                <td className="p-4">{record.SUBDIVISION}</td>
                <td className="p-4">{record.YEAR}</td>
                <td className="p-4">
                  {record.ANNUAL ?? "N/A"} mm
                </td>
                <td className="p-4">
                  {record.JJAS ?? "N/A"} mm
                </td>
                <td className="p-4">
                  {record.MAM ?? "N/A"} mm
                </td>
                <td className="p-4">
                  {record.OND ?? "N/A"} mm
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-slate-500 text-sm">
        Showing the first 20 records from the historical IMD dataset.
      </p>
    </main>
  );
}