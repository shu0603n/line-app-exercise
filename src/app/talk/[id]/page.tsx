import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TalkScreen from "@/components/TalkScreen";

interface Props {
  params: Promise<{ id: string }>;
}

async function getData(id: number) {
  const [room, messages] = await Promise.all([
    prisma.chatRoom.findUnique({ where: { id } }),
    prisma.message.findMany({
      where: { roomId: id },
      orderBy: { sentAt: "asc" },
    }),
  ]);
  return { room, messages };
}

export default async function TalkRoomPage({ params }: Props) {
  const { id } = await params;
  const roomId = Number(id);
  if (isNaN(roomId)) notFound();

  const { room, messages } = await getData(roomId);
  if (!room) notFound();

  return <TalkScreen room={room} initialMessages={messages} />;
}
