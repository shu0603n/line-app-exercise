import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const systemInfo = await prisma.systemInfo.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!systemInfo) {
      return NextResponse.json(
        { error: "System info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error("Failed to fetch system info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
