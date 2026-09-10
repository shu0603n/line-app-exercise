package com.example.lineapp.controller;

import com.example.lineapp.dto.MessageRequest;
import com.example.lineapp.entity.Message;
import com.example.lineapp.repository.MessageRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

// start add 2026.07.19 takenami
import jakarta.servlet.http.HttpSession;
// end add 2026.07.19 takenami

@RestController
@RequestMapping("/api")
public class ApiController {

    private final MessageRepository messageRepository;

    public ApiController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * メッセージ送信API
     * POST /api/rooms/{id}/messages
     */
    @PostMapping("/rooms/{id}/messages")
    public ResponseEntity<?> createMessage(
            @PathVariable Integer id,
            @RequestBody MessageRequest request,

            // start add 2026.07.19 takenami
            HttpSession session
            // end add 2026.07.19 takenami

    ) {

        // start add 2026.07.19 takenami
        // ログインしているか確認
        if (session.getAttribute("loginUserId") == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("{\"error\":\"ログインが必要です\"}");
        }
        // end add 2026.07.19 takenami


        // メッセージが空の場合は送信しない
        if (request.getContent() == null
                || request.getContent().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("{\"error\":\"メッセージを入力してください\"}");
        }


        // メッセージデータを作成
        Message message = new Message();

        // どのトークルームのメッセージか
        message.setRoomId(id);

        // ログインしているユーザー名を取得
        String loginUserName =
                (String) session.getAttribute("loginUserName");

        // ユーザー名が取得できた場合はその名前を使用
        if (loginUserName != null) {
            message.setSenderName(loginUserName);
        } else {
            message.setSenderName("自分");
        }

        // 入力されたメッセージ
        message.setContent(request.getContent().trim());

        // 自分が送信したメッセージ
        message.setIsMine(true);

        // 現在時刻
        message.setSentAt(LocalDateTime.now());


        // DBにメッセージを保存
        Message saved =
                messageRepository.save(message);


        // 保存したメッセージを返す
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);

    }
}