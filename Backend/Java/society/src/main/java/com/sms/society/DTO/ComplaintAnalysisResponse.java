package com.sms.society.DTO;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Structured DTO for AI-Powered Complaint Analysis Response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintAnalysisResponse {

    private String overallSummary;
    private int totalComplaintsAnalyzed;
    private List<RecurringIssue> recurringIssues;
    private List<ComplaintAnalysisItem> complaintAnalyses;
    private List<String> recommendedActions;
    private RagContextInfo ragContext;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecurringIssue {
        private String category;
        private String description;
        private int count;
        private String location;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplaintAnalysisItem {
        private Long complaintId;
        private String category;
        private String suggestedPriority; // HIGH, MEDIUM, LOW
        private String reason;
        private String recommendedAction;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RagContextInfo {
        private String appliedBylawSlaRules;
        private int knowledgeItemsRetrieved;
    }
}
