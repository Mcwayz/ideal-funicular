package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.dto.DocumentDTO;
import com.acmecorp.pmplatform.entity.Document;
import com.acmecorp.pmplatform.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public List<DocumentDTO> getDocumentsByProjectId(UUID projectId) {
        return documentRepository.findByProjectIdAndIsDeletedFalse(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO> getAllDocuments() {
        return documentRepository.findAll().stream()
                .filter(doc -> !doc.isDeleted())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DocumentDTO convertToDTO(Document doc) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(doc.getId());
        dto.setProjectId(doc.getProject().getId());
        dto.setName(doc.getName());
        dto.setFileType(doc.getFileType());
        dto.setFileSize(doc.getFileSize());
        dto.setFilePath(doc.getFilePath());
        if (doc.getUploadedBy() != null) {
            dto.setUploadedById(doc.getUploadedBy().getId());
            dto.setUploadedByName(doc.getUploadedBy().getFirstName() + " " + doc.getUploadedBy().getLastName());
        }
        dto.setCreatedAt(doc.getCreatedAt());
        dto.setVersion(doc.getVersion());
        return dto;
    }
}
