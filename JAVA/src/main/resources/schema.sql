-- このファイルはリファレンス用です。
-- application.properties で spring.sql.init.mode=never に設定されているため自動実行されません。
-- 新規DBセットアップ時は手動で実行してください。

CREATE TABLE IF NOT EXISTS system_info (
    id          SERIAL PRIMARY KEY,
    system_name VARCHAR(255) NOT NULL,
    version     VARCHAR(255) NOT NULL,
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_rooms (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    avatar     VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id          SERIAL PRIMARY KEY,
    room_id     INTEGER      NOT NULL REFERENCES chat_rooms (id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    content     TEXT         NOT NULL,
    is_mine     BOOLEAN      NOT NULL DEFAULT FALSE,
    sent_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);
