package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.dto.TaskDTO;
import com.acmecorp.pmplatform.entity.Project;
import com.acmecorp.pmplatform.entity.Task;
import com.acmecorp.pmplatform.repository.ProjectRepository;
import com.acmecorp.pmplatform.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<TaskDTO> getTasksByProjectId(UUID projectId) {
        return taskRepository.findByProjectIdAndIsDeletedFalse(projectId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO createTask(UUID projectId, TaskDTO dto) {
        Project project = projectRepository.findById(projectId).orElseThrow();

        Task task = new Task();
        task.setProject(project);
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "TODO");
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        task.setEstimatedHours(dto.getEstimatedHours());

        if (dto.getDueDate() != null && !dto.getDueDate().isBlank()) {
            try {
                task.setDueDate(java.time.LocalDate.parse(dto.getDueDate()).atStartOfDay());
            } catch (Exception e) {
                // Ignore unparseable date
            }
        }

        if (dto.getStartDate() != null && !dto.getStartDate().isBlank()) {
            try {
                task.setStartDate(java.time.LocalDate.parse(dto.getStartDate()).atStartOfDay());
            } catch (Exception e) {
                // Ignore unparseable date
            }
        }

        Task saved = taskRepository.save(task);
        return mapToDTO(saved);
    }

    private TaskDTO mapToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
        }
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setStartDate(task.getStartDate() != null ? task.getStartDate().toLocalDate().toString() : null);
        dto.setDueDate(task.getDueDate() != null ? task.getDueDate().toLocalDate().toString() : null);
        dto.setEstimatedHours(task.getEstimatedHours());
        return dto;
    }
}
