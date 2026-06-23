package com.example.lineapp.repository;

import com.example.lineapp.entity.SystemInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemInfoRepository extends JpaRepository<SystemInfo, Integer> {
    Optional<SystemInfo> findFirstByIsActiveTrueOrderByCreatedAtDesc();
}
