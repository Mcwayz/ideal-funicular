package com.acmecorp.pmplatform.dto;

import java.util.UUID;

public class RiskDTO {
    private UUID id;
    private UUID projectId;
    private String title;
    private String description;
    private String probability;
    private String impact;
    private String status;
    private String mitigationPlan;
    private UUID ownerId;
    private String ownerName;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getProjectId() { return projectId; }
    public void setProjectId(UUID projectId) { this.projectId = projectId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProbability() { return probability; }
    public void setProbability(String probability) { this.probability = probability; }
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMitigationPlan() { return mitigationPlan; }
    public void setMitigationPlan(String mitigationPlan) { this.mitigationPlan = mitigationPlan; }
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
}
