# LINE App — Next.js

LINEを模したメッセージングシステムのプロトタイプです。  
Next.js (App Router) + Prisma 7 + Vercel PostgreSQL で構築しています。

---

## 画面構成

| URL | 画面 |
|-----|------|
| `/` | ログイン画面 |
| `/talk` | トーク一覧 |
| `/talk/[id]` | 個別トーク（メッセージ送受信） |

---

## 技術スタック

| カテゴリ | 使用技術 |
|----------|----------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| スタイル | Tailwind CSS v4 |
| ORM | Prisma 7 |
| データベース | PostgreSQL（Vercel Postgres / Neon） |
| DB アダプター | `@prisma/adapter-pg` + `pg` |
| ランタイム | Node.js 20 以上 |

---

## 前提条件

以下がインストールされていることを確認してください。

- **Node.js** v20 以上 → [https://nodejs.org/](https://nodejs.org/)
- **yarn** または **npm**（yarn の場合: `npm install -g yarn`）
- **PostgreSQL データベース**（Vercel Postgres 推奨） → [https://vercel.com/storage/postgres](https://vercel.com/storage/postgres)

---

## 環境構築手順

### 1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd line-app-nextjs
```

### 2. 依存パッケージをインストール

```bash
yarn install
# または
npm install
```

### 3. 環境変数を設定

プロジェクトルートに `.env` ファイルを作成し、以下の内容を記入します。

```env
# 通常クエリ用（PgBouncer プーリング接続）
DATABASE_URL="postgresql://<ユーザー名>:<パスワード>@<ホスト>/<DB名>?sslmode=require&connect_timeout=15&pgbouncer=true"

# マイグレーション・シード用（直接接続）
DATABASE_URL_NON_POOLING="postgresql://<ユーザー名>:<パスワード>@<ホスト（-pooler なし）>/<DB名>?sslmode=require"
```

> **Vercel Postgres を使う場合**  
> Vercel ダッシュボード → Storage → 対象 DB を選択 → `.env.local` タブから接続情報をコピーしてください。

### 4. Prisma クライアントを生成

```bash
yarn db:generate
# または
npm run db:generate
```

### 5. データベースにテーブルを作成

```bash
yarn db:push
# または
npm run db:push
```

> スキーマ（`prisma/schema.prisma`）を変更したときも、このコマンドを再実行してください。

### 6. 初期データを投入

```bash
yarn db:seed
# または
npm run db:seed
```

システム情報・チャットルーム・サンプルメッセージが登録されます。

### 7. 開発サーバーを起動

```bash
yarn dev
# または
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと画面が表示されます。

---

## コマンド一覧

| コマンド | 内容 |
|----------|------|
| `yarn dev` | 開発サーバー起動（ホットリロード有効） |
| `yarn build` | 本番用ビルド |
| `yarn start` | 本番サーバー起動（`build` 実行後に使用） |
| `yarn lint` | ESLint によるコード検査 |
| `yarn db:generate` | Prisma クライアントを再生成 |
| `yarn db:push` | スキーマ変更を DB に反映 |
| `yarn db:seed` | 初期データを投入 |
| `yarn db:studio` | Prisma Studio（DB の GUI 管理画面）を起動 |

---

## ディレクトリ構成

```
line-app-nextjs/
├── prisma/
│   ├── schema.prisma           # DB スキーマ定義
│   └── seed.ts                 # 初期データ投入スクリプト
├── prisma.config.ts            # Prisma 設定（DB 接続先）
├── src/
│   ├── app/
│   │   ├── page.tsx                          # ログイン画面ページ
│   │   ├── layout.tsx                        # 共通レイアウト
│   │   ├── globals.css                       # グローバルスタイル・CSS 変数
│   │   ├── talk/
│   │   │   ├── page.tsx                      # トーク一覧ページ
│   │   │   └── [id]/page.tsx                 # 個別トークページ
│   │   └── api/
│   │       ├── system-info/route.ts          # GET /api/system-info
│   │       └── rooms/[id]/messages/route.ts  # POST /api/rooms/:id/messages
│   ├── components/
│   │   ├── AppShell.tsx        # 全画面共通の外枠コンポーネント
│   │   ├── AppHeader.tsx       # 全画面共通ヘッダー
│   │   ├── LoginScreen.tsx     # ログイン画面 UI
│   │   ├── HomeScreen.tsx      # トーク一覧 UI
│   │   └── TalkScreen.tsx      # 個別トーク UI
│   ├── lib/
│   │   └── prisma.ts           # Prisma クライアントのシングルトン
│   └── generated/
│       └── prisma/             # Prisma が自動生成（編集不可）
├── .env                        # 環境変数（Git 管理対象外推奨）
├── package.json
└── tsconfig.json
```

---

## DB スキーマ

### `system_info` テーブル

システム名・バージョンを管理します。ログイン画面とトーク一覧のヘッダーに表示されます。

| カラム | 型 | 説明 |
|--------|----|------|
| id | Int | 主キー（自動採番） |
| system_name | String | システム名 |
| version | String | バージョン番号 |
| description | String? | 説明文（省略可） |
| is_active | Boolean | 有効フラグ |
| created_at | DateTime | 作成日時 |
| updated_at | DateTime | 更新日時 |

### `chat_rooms` テーブル

トーク一覧に表示されるチャットルームです。

| カラム | 型 | 説明 |
|--------|----|------|
| id | Int | 主キー（自動採番） |
| name | String | ルーム名（相手の名前またはグループ名） |
| avatar | String | アバターに表示する文字 |
| created_at | DateTime | 作成日時 |

### `messages` テーブル

各チャットルームのメッセージを管理します。

| カラム | 型 | 説明 |
|--------|----|------|
| id | Int | 主キー（自動採番） |
| room_id | Int | 所属するチャットルームの ID |
| sender_name | String | 送信者名 |
| content | String | メッセージ本文 |
| is_mine | Boolean | 自分が送信したメッセージかどうか |
| sent_at | DateTime | 送信日時 |

---

## API エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| `GET` | `/api/system-info` | アクティブなシステム情報を取得 |
| `POST` | `/api/rooms/:id/messages` | 指定ルームにメッセージを送信 |

**POST `/api/rooms/:id/messages` リクエスト例**

```json
{ "content": "こんにちは！" }
```

---

## 注意事項

- `.env` ファイルには DB のパスワードが含まれます。**Git にコミットしないよう** `.gitignore` に `.env` を追加してください。
- `src/generated/prisma/` は Prisma が自動生成するディレクトリです。直接編集せず、スキーマ変更後は必ず `yarn db:generate` を再実行してください。
- `DATABASE_URL`（プーリング接続）と `DATABASE_URL_NON_POOLING`（直接接続）は用途が異なります。マイグレーションやシードには必ず `DATABASE_URL_NON_POOLING` を使用してください。
