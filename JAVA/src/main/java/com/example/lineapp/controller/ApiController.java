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

    @PostMapping("/rooms/{id}/messages")
    public ResponseEntity<?> createMessage(@PathVariable Integer id,
                                           @RequestBody MessageRequest request
                                            // start add 2026.07.19 takenami
                                           ,HttpSession session
                                            // end add 2026.07.19 takenami
                                            ) {
        // start add 2026.07.19 takenami
        if (session.getAttribute("loginUserId") == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"error\":\"ログインが必要です\"}");
        }
        // end add 2026.07.19 takenami

        if (request.getContent() == null || request.getContent().isBlank()) {
        return ResponseEntity.badRequest().body("{\"error\":\"Content is required\"}");
        }

        Message message = new Message();
        message.setRoomId(id);
        message.setSenderName("自分");
        message.setContent(request.getContent().trim());
        message.setIsMine(true);
        message.setSentAt(LocalDateTime.now());

        Message saved = messageRepository.save(message);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
