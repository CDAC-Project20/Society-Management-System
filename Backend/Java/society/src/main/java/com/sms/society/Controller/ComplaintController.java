package com.sms.society.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sms.society.DTO.ComplaintDTO;
import com.sms.society.Service.ComplaintService;
import com.sms.society.Utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = {"/api/society/complaints", "/complaints"})
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getComplaintsBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            List<ComplaintDTO.Response> complaints = complaintService.getComplaintsBySociety(societyId);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/raise")
    public ResponseEntity<?> raiseComplaint(@RequestBody ComplaintDTO.Request complaintRequest) {
        try {
            ComplaintDTO.Response response = complaintService.raiseComplaint(complaintRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody ComplaintDTO.StatusUpdateRequest updateRequest,
            HttpServletRequest request) {
        try {
            ComplaintDTO.Response updated = complaintService.updateComplaintStatus(id, updateRequest);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @Autowired
    private com.sms.society.Service.ComplaintSummaryService complaintSummaryService;

    @GetMapping("/analysis")
    public ResponseEntity<?> getComplaintAnalysis(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long societyId,
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "ALL") String status,
            HttpServletRequest request) {
        try {
            com.sms.society.DTO.ComplaintAnalysisResponse response =
                    complaintSummaryService.analyzeComplaints(societyId, status, request);
            return ResponseEntity.ok(response);
        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", se.getMessage()));
        } catch (IllegalStateException ise) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", ise.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}/analysis")
    public ResponseEntity<?> getComplaintAnalysisBySociety(
            @PathVariable Long societyId,
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "ALL") String status,
            HttpServletRequest request) {
        try {
            com.sms.society.DTO.ComplaintAnalysisResponse response =
                    complaintSummaryService.analyzeComplaints(societyId, status, request);
            return ResponseEntity.ok(response);
        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", se.getMessage()));
        } catch (IllegalStateException ise) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", ise.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}

