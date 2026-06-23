import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString =
  process.env.DATABASE_URL_NON_POOLING ?? process.env.DATABASE_URL ?? "";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // システム情報
  await prisma.systemInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      systemName: "LINE App",
      version: "1.0.0",
      description: "LINEを模したメッセージングシステム",
      isActive: true,
    },
  });

  // チャットルーム & メッセージ
  const rooms = [
    {
      name: "田中 太郎",
      avatar: "田",
      messages: [
        { senderName: "田中 太郎", content: "お疲れ様です！", isMine: false, offsetMin: 30 },
        { senderName: "自分", content: "お疲れ様です！", isMine: true, offsetMin: 29 },
        { senderName: "田中 太郎", content: "明日の会議の資料、共有してもらえますか？", isMine: false, offsetMin: 20 },
        { senderName: "自分", content: "もちろんです！少々お待ちください", isMine: true, offsetMin: 18 },
        { senderName: "自分", content: "送りました。確認お願いします🙏", isMine: true, offsetMin: 15 },
        { senderName: "田中 太郎", content: "ありがとうございます！確認します", isMine: false, offsetMin: 10 },
        { senderName: "田中 太郎", content: "明日の件、よろしくお願いします！", isMine: false, offsetMin: 2 },
      ],
    },
    {
      name: "鈴木 花子",
      avatar: "鈴",
      messages: [
        { senderName: "鈴木 花子", content: "今日のランチどうする？", isMine: false, offsetMin: 120 },
        { senderName: "自分", content: "イタリアンがいいな！", isMine: true, offsetMin: 115 },
        { senderName: "鈴木 花子", content: "じゃあ駅前の店にしよう", isMine: false, offsetMin: 110 },
        { senderName: "鈴木 花子", content: "写真送ったよ〜！", isMine: false, offsetMin: 60 },
        { senderName: "自分", content: "おいしそう！", isMine: true, offsetMin: 55 },
      ],
    },
    {
      name: "開発チーム",
      avatar: "開",
      messages: [
        { senderName: "佐藤", content: "PRレビューお願いします", isMine: false, offsetMin: 180 },
        { senderName: "自分", content: "確認します！", isMine: true, offsetMin: 175 },
        { senderName: "伊藤", content: "テスト環境でエラーが出てます", isMine: false, offsetMin: 90 },
        { senderName: "佐藤", content: "調査中です", isMine: false, offsetMin: 85 },
        { senderName: "佐藤", content: "ビルド完了しました", isMine: false, offsetMin: 65 },
        { senderName: "自分", content: "ありがとうございます！デプロイします", isMine: true, offsetMin: 60 },
      ],
    },
    {
      name: "山田 次郎",
      avatar: "山",
      messages: [
        { senderName: "山田 次郎", content: "先日はありがとうございました", isMine: false, offsetMin: 1440 },
        { senderName: "自分", content: "こちらこそ！またよろしくお願いします", isMine: true, offsetMin: 1430 },
        { senderName: "山田 次郎", content: "ありがとうございます", isMine: false, offsetMin: 1420 },
      ],
    },
    {
      name: "プロジェクトA",
      avatar: "プ",
      messages: [
        { senderName: "伊藤", content: "キックオフ資料を作成しました", isMine: false, offsetMin: 2880 },
        { senderName: "自分", content: "確認しました。よくできています！", isMine: true, offsetMin: 2870 },
        { senderName: "伊藤", content: "資料を共有しました", isMine: false, offsetMin: 1500 },
      ],
    },
  ];

  const now = new Date();

  for (const [i, room] of rooms.entries()) {
    const existing = await prisma.chatRoom.findFirst({ where: { name: room.name } });
    const chatRoom = existing ?? await prisma.chatRoom.create({
      data: { name: room.name, avatar: room.avatar },
    });

    for (const msg of room.messages) {
      const sentAt = new Date(now.getTime() - msg.offsetMin * 60 * 1000);
      await prisma.message.create({
        data: {
          roomId: chatRoom.id,
          senderName: msg.senderName,
          content: msg.content,
          isMine: msg.isMine,
          sentAt,
        },
      });
    }

    console.log(`Room ${i + 1}: ${room.name} created`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
