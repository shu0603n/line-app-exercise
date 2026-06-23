-- spring.sql.init.mode=always で起動時に自動実行されます。
-- 全てのINSERT文はべき等(idempotent)です。重複挿入しません。

-- システム情報
INSERT INTO system_info (system_name, version, description, is_active)
SELECT 'LINE App', '1.0.0', 'LINEを模したメッセージングシステム', true
WHERE NOT EXISTS (SELECT 1 FROM system_info WHERE id = 1);

-- 田中 太郎
INSERT INTO chat_rooms (name, avatar)
SELECT '田中 太郎', '田'
WHERE NOT EXISTS (SELECT 1 FROM chat_rooms WHERE name = '田中 太郎');

INSERT INTO messages (room_id, sender_name, content, is_mine, sent_at)
SELECT r.id, v.sn, v.ct, v.im, NOW() - v.off
FROM chat_rooms r,
(VALUES
    ('田中 太郎'::varchar, 'お疲れ様です！'::varchar,                           false::boolean, INTERVAL '30 minutes'),
    ('自分',              'お疲れ様です！',                                      true,           INTERVAL '29 minutes'),
    ('田中 太郎',         '明日の会議の資料、共有してもらえますか？',             false,          INTERVAL '20 minutes'),
    ('自分',              'もちろんです！少々お待ちください',                     true,           INTERVAL '18 minutes'),
    ('自分',              '送りました。確認お願いします🙏',                       true,           INTERVAL '15 minutes'),
    ('田中 太郎',         'ありがとうございます！確認します',                     false,          INTERVAL '10 minutes'),
    ('田中 太郎',         '明日の件、よろしくお願いします！',                     false,          INTERVAL '2 minutes')
) AS v(sn, ct, im, off)
WHERE r.name = '田中 太郎'
AND NOT EXISTS (SELECT 1 FROM messages WHERE room_id = r.id);

-- 鈴木 花子
INSERT INTO chat_rooms (name, avatar)
SELECT '鈴木 花子', '鈴'
WHERE NOT EXISTS (SELECT 1 FROM chat_rooms WHERE name = '鈴木 花子');

INSERT INTO messages (room_id, sender_name, content, is_mine, sent_at)
SELECT r.id, v.sn, v.ct, v.im, NOW() - v.off
FROM chat_rooms r,
(VALUES
    ('鈴木 花子'::varchar, '今日のランチどうする？'::varchar, false::boolean, INTERVAL '120 minutes'),
    ('自分',              'イタリアンがいいな！',            true,            INTERVAL '115 minutes'),
    ('鈴木 花子',         'じゃあ駅前の店にしよう',          false,           INTERVAL '110 minutes'),
    ('鈴木 花子',         '写真送ったよ〜！',                false,           INTERVAL '60 minutes'),
    ('自分',              'おいしそう！',                    true,            INTERVAL '55 minutes')
) AS v(sn, ct, im, off)
WHERE r.name = '鈴木 花子'
AND NOT EXISTS (SELECT 1 FROM messages WHERE room_id = r.id);

-- 開発チーム
INSERT INTO chat_rooms (name, avatar)
SELECT '開発チーム', '開'
WHERE NOT EXISTS (SELECT 1 FROM chat_rooms WHERE name = '開発チーム');

INSERT INTO messages (room_id, sender_name, content, is_mine, sent_at)
SELECT r.id, v.sn, v.ct, v.im, NOW() - v.off
FROM chat_rooms r,
(VALUES
    ('佐藤'::varchar, 'PRレビューお願いします'::varchar,           false::boolean, INTERVAL '180 minutes'),
    ('自分',          '確認します！',                              true,            INTERVAL '175 minutes'),
    ('伊藤',          'テスト環境でエラーが出てます',               false,           INTERVAL '90 minutes'),
    ('佐藤',          '調査中です',                                false,           INTERVAL '85 minutes'),
    ('佐藤',          'ビルド完了しました',                         false,           INTERVAL '65 minutes'),
    ('自分',          'ありがとうございます！デプロイします',        true,            INTERVAL '60 minutes')
) AS v(sn, ct, im, off)
WHERE r.name = '開発チーム'
AND NOT EXISTS (SELECT 1 FROM messages WHERE room_id = r.id);

-- 山田 次郎
INSERT INTO chat_rooms (name, avatar)
SELECT '山田 次郎', '山'
WHERE NOT EXISTS (SELECT 1 FROM chat_rooms WHERE name = '山田 次郎');

INSERT INTO messages (room_id, sender_name, content, is_mine, sent_at)
SELECT r.id, v.sn, v.ct, v.im, NOW() - v.off
FROM chat_rooms r,
(VALUES
    ('山田 次郎'::varchar, '先日はありがとうございました'::varchar,         false::boolean, INTERVAL '1440 minutes'),
    ('自分',              'こちらこそ！またよろしくお願いします',             true,            INTERVAL '1430 minutes'),
    ('山田 次郎',         'ありがとうございます',                           false,           INTERVAL '1420 minutes')
) AS v(sn, ct, im, off)
WHERE r.name = '山田 次郎'
AND NOT EXISTS (SELECT 1 FROM messages WHERE room_id = r.id);

-- プロジェクトA
INSERT INTO chat_rooms (name, avatar)
SELECT 'プロジェクトA', 'プ'
WHERE NOT EXISTS (SELECT 1 FROM chat_rooms WHERE name = 'プロジェクトA');

INSERT INTO messages (room_id, sender_name, content, is_mine, sent_at)
SELECT r.id, v.sn, v.ct, v.im, NOW() - v.off
FROM chat_rooms r,
(VALUES
    ('伊藤'::varchar, 'キックオフ資料を作成しました'::varchar,      false::boolean, INTERVAL '2880 minutes'),
    ('自分',          '確認しました。よくできています！',            true,            INTERVAL '2870 minutes'),
    ('伊藤',          '資料を共有しました',                         false,           INTERVAL '1500 minutes')
) AS v(sn, ct, im, off)
WHERE r.name = 'プロジェクトA'
AND NOT EXISTS (SELECT 1 FROM messages WHERE room_id = r.id);
