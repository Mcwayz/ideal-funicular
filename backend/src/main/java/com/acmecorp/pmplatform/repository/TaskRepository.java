package com.acmecorp.pmplatform.repository;

import com.acmecorp.pmplatform.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByProjectIdAndIsDeletedFalse(UUID projectId);
    List<Task> findByAssigneeIdAndIsDeletedFalse(UUID assigneeId);
}
