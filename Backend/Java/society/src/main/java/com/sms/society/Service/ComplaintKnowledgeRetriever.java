package com.sms.society.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Component;
import com.sms.society.Entities.Complaint;

/**
 * Domain Knowledge Retriever (Lightweight In-Memory RAG implementation).
 * Retrieves domain knowledge regarding housing society maintenance bylaws,
 * SLA standards, and escalation protocols tailored to the complaints being analyzed.
 */
@Component
public class ComplaintKnowledgeRetriever {

    private final Map<String, String> bylawPolicyStore = new HashMap<>();

    public ComplaintKnowledgeRetriever() {
        initKnowledgeStore();
    }

    private void initKnowledgeStore() {
        bylawPolicyStore.put("PLUMBING",
            "[Bylaw §4.1 - Water Supply & Plumbing]: High priority due to seepage and structural risk. " +
            "Emergency SLA: 2-4 hours for pipe bursts or active leaks. Action: Isolate main valve and dispatch society plumber.");

        bylawPolicyStore.put("ELECTRICAL",
            "[Bylaw §4.2 - Electrical Systems]: Urgent priority for common infrastructure (elevators, staircases, water pump rooms). " +
            "SLA: 2 hours for common areas; 6 hours for internal flat supply faults. Action: Inspect MCB/distribution board and alert licensed electrician.");

        bylawPolicyStore.put("LIFT MAINTENANCE",
            "[Bylaw §4.3 - Elevators & Vertical Transport]: Emergency/High priority. " +
            "SLA: 1 hour response time. Risk to resident mobility and safety demands instant technician dispatch and 'Out of Order' signage.");

        bylawPolicyStore.put("SECURITY",
            "[Bylaw §4.4 - Safety & Security]: High priority. " +
            "SLA: 2 hours. Gate entry issues, CCTV blindspots, or unauthorized access require immediate guard rotation and perimeter verification.");

        bylawPolicyStore.put("SANITATION",
            "[Bylaw §4.5 - Hygiene & Waste Management]: Medium priority. " +
            "SLA: 24 hours. Garbage accumulation, pest outbreaks, or drainage odor must trigger housekeeping supervisor escalation.");

        bylawPolicyStore.put("PARKING",
            "[Bylaw §4.6 - Parking & Vehicle Bays]: Low to Medium priority. " +
            "SLA: 24-48 hours. Unauthorized parking or driveway blocking is addressed via security notification, owner contact, or committee warning sticker.");

        bylawPolicyStore.put("GENERAL MAINTENANCE",
            "[Bylaw §4.7 - Common Area Maintenance]: Standard priority. " +
            "SLA: 48-72 hours. Painting, plastering, garden upkeep, or non-hazardous fixture repairs scheduled during regular working hours.");
    }

    /**
     * Retrieves relevant bylaws and SLA benchmarks matching the complaint categories in the batch.
     */
    public String retrieveKnowledgeForComplaints(List<Complaint> complaints) {
        if (complaints == null || complaints.isEmpty()) {
            return "No specific bylaws retrieved.";
        }

        Set<String> matchedCategories = new HashSet<>();
        for (Complaint c : complaints) {
            String cat = c.getCategory() != null ? c.getCategory().toUpperCase().trim() : "";
            for (String key : bylawPolicyStore.keySet()) {
                if (cat.contains(key) || key.contains(cat)) {
                    matchedCategories.add(key);
                }
            }
        }

        if (matchedCategories.isEmpty()) {
            matchedCategories.add("GENERAL MAINTENANCE");
            matchedCategories.add("PLUMBING");
            matchedCategories.add("ELECTRICAL");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("RETRIEVED SOCIETY BYLAWS & SLA RESOLUTION STANDARDS (RAG CONTEXT):\n");
        for (String cat : matchedCategories) {
            sb.append("- ").append(bylawPolicyStore.get(cat)).append("\n");
        }
        sb.append("- [Bylaw §5.0 - Recurring Defect Rule]: If 2 or more complaints refer to the same wing, pipe column, or flat, classify as a systemic recurring defect requiring committee audit.\n");

        return sb.toString();
    }

    public int getRetrievedCount(List<Complaint> complaints) {
        if (complaints == null || complaints.isEmpty()) return 0;
        Set<String> matched = new HashSet<>();
        for (Complaint c : complaints) {
            String cat = c.getCategory() != null ? c.getCategory().toUpperCase().trim() : "";
            for (String key : bylawPolicyStore.keySet()) {
                if (cat.contains(key) || key.contains(cat)) {
                    matched.add(key);
                }
            }
        }
        return matched.isEmpty() ? 3 : matched.size() + 1;
    }
}
