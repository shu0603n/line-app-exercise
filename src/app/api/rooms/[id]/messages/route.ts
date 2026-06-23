import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const roomId = Number(id);
  if (isNaN(roomId)) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  const body = await req.json();
  const content: string = (body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      roomId,
      senderName: "自分",
      content,
      isMine: true,
    },
  });

  return NextResponse.json(message, { status: 201 });
}
