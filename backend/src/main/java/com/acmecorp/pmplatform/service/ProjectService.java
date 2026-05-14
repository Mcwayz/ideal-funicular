package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.dto.ProjectDTO;
import com.acmecorp.pmplatform.entity.Project;
import com.acmecorp.pmplatform.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .filter(p -> !p.isDeleted())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO createProject(ProjectDTO dto) {
        Project project = new Project();
        // Set fields
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus() != null ? dto.getStatus() : "PLANNING");
        project.setType(dto.getType());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setBudget(dto.getBudget());
        project.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "USD");

        Project saved = projectRepository.save(project);
        return mapToDTO(saved);
    }

    private ProjectDTO mapToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setType(project.getType());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setBudget(project.getBudget());
        dto.setCurrency(project.getCurrency());
        return dto;
    }
}
