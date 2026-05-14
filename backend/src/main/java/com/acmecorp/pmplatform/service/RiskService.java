package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.dto.RiskDTO;
import com.acmecorp.pmplatform.entity.Project;
import com.acmecorp.pmplatform.entity.Risk;
import com.acmecorp.pmplatform.repository.ProjectRepository;
import com.acmecorp.pmplatform.repository.RiskRepository;
import com.acmecorp.pmplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RiskService {

    @Autowired
    private RiskRepository riskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RiskDTO> getRisksByProjectId(UUID projectId) {
        return riskRepository.findByProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RiskDTO> getAllRisks() {
        return riskRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private RiskDTO convertToDTO(Risk risk) {
        RiskDTO dto = new RiskDTO();
        dto.setId(risk.getId());
        dto.setProjectId(risk.getProject().getId());
        dto.setTitle(risk.getTitle());
        dto.setDescription(risk.getDescription());
        dto.setProbability(risk.getProbability());
        dto.setImpact(risk.getImpact());
        dto.setStatus(risk.getStatus());
        dto.setMitigationPlan(risk.getMitigationPlan());
        if (risk.getOwner() != null) {
            dto.setOwnerId(risk.getOwner().getId());
            dto.setOwnerName(risk.getOwner().getFirstName() + " " + risk.getOwner().getLastName());
        }
        return dto;
    }
}
