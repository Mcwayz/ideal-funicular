package com.acmecorp.pmplatform.repository;

import com.acmecorp.pmplatform.entity.Risk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RiskRepository extends JpaRepository<Risk, UUID> {
    List<Risk> findByProjectId(UUID projectId);
}
