package com.example.lineapp.repository;

import com.example.lineapp.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    List<ChatRoom> findAllByOrderByCreatedAtAsc();
}
