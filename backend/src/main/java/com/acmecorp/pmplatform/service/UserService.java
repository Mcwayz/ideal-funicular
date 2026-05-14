package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.dto.UserDTO;
import com.acmecorp.pmplatform.entity.User;
import com.acmecorp.pmplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.isDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByProjectId(UUID projectId) {
        // Simple implementation: for now return all users in the organization
        // In a real app, this would filter by project assignment
        return getAllUsers();
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setAvatarUrl(user.getAvatarUrl());
        // Simple role extraction
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            dto.setRole(user.getRoles().iterator().next().getName());
        } else {
            dto.setRole("Member");
        }
        return dto;
    }
}
