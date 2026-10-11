package com.sms.society;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClient.ChatClientRequestSpec;
import org.springframework.ai.chat.client.ChatClient.CallResponseSpec;
import org.springframework.test.util.ReflectionTestUtils;

import com.sms.society.DTO.ComplaintAnalysisResponse;
import com.sms.society.Entities.Complaint;
import com.sms.society.Entities.Flat;
import com.sms.society.Entities.Society;
import com.sms.society.Repository.ComplaintRepo;
import com.sms.society.Service.ComplaintKnowledgeRetriever;
import com.sms.society.Service.ComplaintSummaryService;
import com.sms.society.Utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
public class ComplaintSummaryServiceTest {

    @Mock
    private ChatClient chatClient;

    @Mock
    private ComplaintRepo complaintRepo;

    @Mock
    private ComplaintKnowledgeRetriever knowledgeRetriever;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private ComplaintSummaryService complaintSummaryService;

    @BeforeEach
    public void setup() {
        ReflectionTestUtils.setField(complaintSummaryService, "geminiApiKey", "test-valid-gemini-key");
    }

    private void mockAuthorizedSecretary() {
        when(jwtUtil.extractTokenFromRequest(request)).thenReturn("valid-secretary-token");
        when(jwtUtil.extractRole("valid-secretary-token")).thenReturn("Secretary");
    }

    @Test
    public void testEmptyComplaintList_ReturnsGracefulEmptyResponseWithoutCallingGemini() {
        mockAuthorizedSecretary();
        when(complaintRepo.findBySocietyIdOrderByIdDesc(1L)).thenReturn(Collections.emptyList());

        ComplaintAnalysisResponse response = complaintSummaryService.analyzeComplaints(1L, "ALL", request);

        assertNotNull(response);
        assertEquals(0, response.getTotalComplaintsAnalyzed());
        assertTrue(response.getRecurringIssues().isEmpty());
        assertTrue(response.getComplaintAnalyses().isEmpty());
        assertTrue(response.getOverallSummary().contains("No complaints found"));
        verify(chatClient, never()).prompt();
    }

    @Test
    public void testUnauthorizedUser_ThrowsSecurityException() {
        when(jwtUtil.extractTokenFromRequest(request)).thenReturn("resident-token");
        when(jwtUtil.extractRole("resident-token")).thenReturn("Tenant");

        SecurityException ex = assertThrows(SecurityException.class, () -> {
            complaintSummaryService.analyzeComplaints(1L, "ALL", request);
        });

        assertTrue(ex.getMessage().contains("Access denied"));
        verify(complaintRepo, never()).findBySocietyIdOrderByIdDesc(any());
    }

    @Test
    public void testMissingApiKey_ThrowsIllegalStateException() {
        mockAuthorizedSecretary();
        ReflectionTestUtils.setField(complaintSummaryService, "geminiApiKey", "");

        Complaint sampleComplaint = new Complaint();
        sampleComplaint.setId(101L);
        sampleComplaint.setTitle("Leakage");
        sampleComplaint.setCategory("Plumbing");
        sampleComplaint.setDescription("Water dripping in flat 302");
        when(complaintRepo.findBySocietyIdOrderByIdDesc(1L)).thenReturn(List.of(sampleComplaint));
        when(knowledgeRetriever.retrieveKnowledgeForComplaints(any())).thenReturn("Plumbing bylaws");
        when(knowledgeRetriever.getRetrievedCount(any())).thenReturn(1);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> {
            complaintSummaryService.analyzeComplaints(1L, "ALL", request);
        });

        assertTrue(ex.getMessage().contains("GEMINI_API_KEY"));
    }

    @Test
    public void testSuccessfulGeminiAnalysis_ReturnsValidatedStructuredResponse() {
        mockAuthorizedSecretary();

        Society society = new Society();
        society.setId(1L);

        Flat flat = new Flat();
        flat.setFlatNumber("B-402");

        Complaint c1 = new Complaint();
        c1.setId(101L);
        c1.setSociety(society);
        c1.setFlat(flat);
        c1.setTitle("Severe water leakage in master toilet");
        c1.setDescription("Water dripping from ceiling onto floor");
        c1.setCategory("Plumbing");
        c1.setStatus("Open");

        Complaint c2 = new Complaint();
        c2.setId(102L);
        c2.setSociety(society);
        c2.setFlat(flat);
        c2.setTitle("Lift stopped at 4th floor");
        c2.setDescription("Lift B jerked and stopped between 3rd and 4th floor");
        c2.setCategory("Lift Maintenance");
        c2.setStatus("Open");

        when(complaintRepo.findBySocietyIdOrderByIdDesc(1L)).thenReturn(List.of(c1, c2));
        when(knowledgeRetriever.retrieveKnowledgeForComplaints(any())).thenReturn("Plumbing and Lift SLAs");
        when(knowledgeRetriever.getRetrievedCount(any())).thenReturn(2);

        String mockGeminiJson = """
        {
          "overallSummary": "Critical plumbing leakage and urgent lift stoppage requiring immediate technician action.",
          "totalComplaintsAnalyzed": 2,
          "recurringIssues": [
            {
              "category": "Plumbing",
              "description": "Bathroom vertical pipe leakage",
              "count": 1,
              "location": "B-Wing"
            }
          ],
          "complaintAnalyses": [
            {
              "complaintId": 101,
              "category": "Plumbing",
              "suggestedPriority": "HIGH",
              "reason": "Risk of seepage and electrical damage to lower floors",
              "recommendedAction": "Isolate plumbing mains and dispatch technician within 2 hours"
            },
            {
              "complaintId": 102,
              "category": "Lift Maintenance",
              "suggestedPriority": "HIGH",
              "reason": "Safety hazard affecting resident transit",
              "recommendedAction": "Place out of order notice and summon elevator emergency engineer"
            }
          ],
          "recommendedActions": [
            "Dispatch elevator maintenance team",
            "Shut off main valve for B-wing vertical riser"
          ]
        }
        """;

        ChatClientRequestSpec requestSpec = mock(ChatClientRequestSpec.class);
        CallResponseSpec responseSpec = mock(CallResponseSpec.class);

        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.system(anyString())).thenReturn(requestSpec);
        when(requestSpec.user(anyString())).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(responseSpec);
        when(responseSpec.content()).thenReturn(mockGeminiJson);

        ComplaintAnalysisResponse response = complaintSummaryService.analyzeComplaints(1L, "ALL", request);

        assertNotNull(response);
        assertEquals(2, response.getTotalComplaintsAnalyzed());
        assertEquals(2, response.getComplaintAnalyses().size());
        assertEquals("HIGH", response.getComplaintAnalyses().get(0).getSuggestedPriority());
        assertEquals(101L, response.getComplaintAnalyses().get(0).getComplaintId());
        assertNotNull(response.getRagContext());
        assertEquals(2, response.getRagContext().getKnowledgeItemsRetrieved());
        assertFalse(response.getRecommendedActions().isEmpty());
    }

    @Test
    public void testMalformedGeminiResponse_ThrowsDescriptiveException() {
        mockAuthorizedSecretary();

        Complaint c = new Complaint();
        c.setId(101L);
        c.setTitle("Noisy neighbors");
        c.setDescription("Loud music late night");
        c.setCategory("Security");

        when(complaintRepo.findBySocietyIdOrderByIdDesc(1L)).thenReturn(List.of(c));
        when(knowledgeRetriever.retrieveKnowledgeForComplaints(any())).thenReturn("Security bylaws");

        ChatClientRequestSpec requestSpec = mock(ChatClientRequestSpec.class);
        CallResponseSpec responseSpec = mock(CallResponseSpec.class);

        when(chatClient.prompt()).thenReturn(requestSpec);
        when(requestSpec.system(anyString())).thenReturn(requestSpec);
        when(requestSpec.user(anyString())).thenReturn(requestSpec);
        when(requestSpec.call()).thenReturn(responseSpec);
        when(responseSpec.content()).thenReturn("INVALID_NOT_A_JSON_RESPONSE");

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            complaintSummaryService.analyzeComplaints(1L, "ALL", request);
        });

        assertTrue(ex.getMessage().contains("Malformed response") || ex.getMessage().contains("AI Complaint Analysis failed"));
    }
}
