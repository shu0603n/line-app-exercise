package com.example.lineapp.controller;

import com.example.lineapp.dto.MessageRequest;
import com.example.lineapp.entity.Message;
import com.example.lineapp.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final MessageRepository messageRepository;

    public ApiController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @PostMapping("/rooms/{id}/messages")
    public ResponseEntity<?> createMessage(@PathVariable Integer id,
                                           @RequestBody MessageRequest request) {
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
