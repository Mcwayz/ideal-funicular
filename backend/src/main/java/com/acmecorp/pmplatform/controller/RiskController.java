package com.acmecorp.pmplatform.controller;

import com.acmecorp.pmplatform.dto.RiskDTO;
import com.acmecorp.pmplatform.service.RiskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/risks")
public class RiskController {

    @Autowired
    private RiskService riskService;

    @GetMapping
    public ResponseEntity<List<RiskDTO>> getAllRisks() {
        return ResponseEntity.ok(riskService.getAllRisks());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<RiskDTO>> getRisksByProjectId(@PathVariable UUID projectId) {
        return ResponseEntity.ok(riskService.getRisksByProjectId(projectId));
    }
}
