import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({ status: "ok", database: "connected" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error"

    return NextResponse.json(
      { status: "error", database: "disconnected", error: message },
      { status: 503 },
    )
  }
}
