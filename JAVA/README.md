# LINE App - Java Spring Boot版

Next.jsで構築したLINE風チャットアプリをJava + Spring Bootで再実装したものです。  
同じPostgreSQLデータベースに接続するため、データはNEXT版と共有されます。

---

## 必要な環境

| ツール | バージョン |
|--------|-----------|
| Java (JDK) | 21以上 |
| Maven | 3.9以上 |

---

## セットアップ手順

### 1. Java (JDK 21) のインストール

**Windowsの場合 — ターミナルを管理者として開いて実行:**

```powershell
winget install EclipseAdoptium.Temurin.21.JDK
```

インストール後、ターミナルを再起動して確認:

```powershell
java -version
# 例: openjdk version "21.0.x" ...
```

---

### 2. Maven のインストール

**Windowsの場合 — Scoop を使用:**

> winget には Apache Maven が登録されていないため、Scoop を使います。

Scoop がまだない場合はまずインストール（管理者不要）:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

Scoop で Maven をインストール:

```powershell
scoop install main/maven
```

インストール後、**新しいターミナルを開いて**確認:

```powershell
mvn -version
# 例: Apache Maven 3.9.x ...
```

> **注意:** インストール後は必ずターミナル(PowerShell / コマンドプロンプト)を閉じて  
> 再度開いてから確認コマンドを実行してください（環境変数の反映のため）。

---

### 3. アプリの起動

```powershell
cd JAVA
mvn spring-boot:run
```

起動後、ブラウザで [http://localhost:8080](http://localhost:8080) を開く。

---

## 環境変数（オプション）

デフォルトでは `application.properties` に設定済みのDB接続情報を使用します。  
別のDBを使う場合は環境変数で上書きできます:

```powershell
$env:POSTGRES_USER     = "your_user"
$env:POSTGRES_PASSWORD = "your_password"
mvn spring-boot:run
```

---

## 画面構成

| URL | 画面 |
|-----|------|
| `http://localhost:8080/` | ログイン画面 |
| `http://localhost:8080/talk` | トークリスト |
| `http://localhost:8080/talk/{id}` | チャットルーム |

---

## 技術スタック

| 役割 | Next.js版 | Java版 |
|------|-----------|--------|
| フレームワーク | Next.js 16 | Spring Boot 3.4 |
| ORM | Prisma | Spring Data JPA |
| テンプレート | React (TSX) | Thymeleaf |
| CSS | Tailwind CSS (ビルド) | Tailwind CSS (CDN) |
| DB | PostgreSQL (Vercel) | 同じDB |
| 言語 | TypeScript | Java 21 |
