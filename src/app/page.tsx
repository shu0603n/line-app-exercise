import { prisma } from "@/lib/prisma";
import LoginScreen from "@/components/LoginScreen";

async function getSystemInfo() {
  try {
    return await prisma.systemInfo.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}

export default async function Home() {
  const systemInfo = await getSystemInfo();
  return <LoginScreen systemInfo={systemInfo} />;
}
