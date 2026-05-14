package com.acmecorp.pmplatform.controller;

import com.acmecorp.pmplatform.dto.DocumentDTO;
import com.acmecorp.pmplatform.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(documentService.getDocumentsByProjectId(projectId));
    }
}
