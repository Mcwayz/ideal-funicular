package com.acmecorp.pmplatform.controller;

import com.acmecorp.pmplatform.dto.UserDTO;
import com.acmecorp.pmplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<UserDTO>> getUsersByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(userService.getUsersByProjectId(projectId));
    }
}
