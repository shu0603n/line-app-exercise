package com.example.lineapp.repository;

import com.example.lineapp.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByRoomIdOrderBySentAtAsc(Integer roomId);
    Optional<Message> findFirstByRoomIdOrderBySentAtDesc(Integer roomId);
}
