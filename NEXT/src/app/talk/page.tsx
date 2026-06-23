import { prisma } from "@/lib/prisma";
import HomeScreen from "@/components/HomeScreen";

async function getData() {
  const [systemInfo, rooms] = await Promise.all([
    prisma.systemInfo.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }).catch(() => null),
    prisma.chatRoom.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1,
          select: { content: true, sentAt: true, isMine: true },
        },
      },
    }).catch(() => []),
  ]);
  return { systemInfo, rooms };
}

export default async function TalkPage() {
  const { systemInfo, rooms } = await getData();
  return <HomeScreen systemInfo={systemInfo} rooms={rooms} />;
}
