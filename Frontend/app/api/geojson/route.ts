import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "app", "data", "map.geojson")
    const raw = await readFile(filePath, "utf8")

    return new NextResponse(raw, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=1800",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "GeoJSON file not available" },
      { status: 500 }
    )
  }
}
