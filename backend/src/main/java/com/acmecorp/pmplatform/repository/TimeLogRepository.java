package com.acmecorp.pmplatform.repository;

import com.acmecorp.pmplatform.entity.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, UUID> {
    List<TimeLog> findByTaskId(UUID taskId);
    List<TimeLog> findByUserId(UUID userId);
}
