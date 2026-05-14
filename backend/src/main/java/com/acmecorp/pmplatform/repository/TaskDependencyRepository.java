package com.acmecorp.pmplatform.repository;

import com.acmecorp.pmplatform.entity.TaskDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskDependencyRepository extends JpaRepository<TaskDependency, TaskDependency.TaskDependencyId> {
    List<TaskDependency> findByPredecessorId(UUID predecessorId);
    List<TaskDependency> findBySuccessorId(UUID successorId);
}
