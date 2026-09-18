import { NextResponse } from "next/server";
import eventData from "@/data/nepal-flood-2026/event.json";

export async function GET() {
  return NextResponse.json(eventData);
}
