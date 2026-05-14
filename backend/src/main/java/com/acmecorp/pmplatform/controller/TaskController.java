package com.acmecorp.pmplatform.controller;

import com.acmecorp.pmplatform.dto.TaskDTO;
import com.acmecorp.pmplatform.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<TaskDTO> createTask(@PathVariable UUID projectId, @RequestBody TaskDTO taskDTO) {
        return ResponseEntity.ok(taskService.createTask(projectId, taskDTO));
    }
}
