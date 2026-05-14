package com.acmecorp.pmplatform.service;

import com.acmecorp.pmplatform.entity.Task;
import com.acmecorp.pmplatform.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectFinanceService {

    @Autowired
    private TaskRepository taskRepository;

    public FinancialSummary getProjectFinancialSummary(UUID projectId) {
        List<Task> tasks = taskRepository.findByProjectIdAndIsDeletedFalse(projectId);

        BigDecimal totalBudgeted = tasks.stream()
                .map(t -> t.getBudgetedCost() != null ? t.getBudgetedCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalActual = tasks.stream()
                .map(t -> t.getActualCost() != null ? t.getActualCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal variance = totalBudgeted.subtract(totalActual);
        BigDecimal healthScore = totalBudgeted.compareTo(BigDecimal.ZERO) > 0 
                ? variance.divide(totalBudgeted, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")) 
                : BigDecimal.ZERO;

        return new FinancialSummary(totalBudgeted, totalActual, variance, healthScore);
    }

    public static class FinancialSummary {
        public final BigDecimal totalBudgeted;
        public final BigDecimal totalActual;
        public final BigDecimal variance;
        public final BigDecimal healthScore;

        public FinancialSummary(BigDecimal totalBudgeted, BigDecimal totalActual, BigDecimal variance, BigDecimal healthScore) {
            this.totalBudgeted = totalBudgeted;
            this.totalActual = totalActual;
            this.variance = variance;
            this.healthScore = healthScore;
        }
    }
}
