package com.sms.society.Controller;

import com.sms.society.DTO.ComplaintDTO;
import com.sms.society.Service.ComplaintService;
import com.sms.society.Utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getComplaintsBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            List<ComplaintDTO.Response> complaints = complaintService.getComplaintsBySociety(societyId);
            return ResponseEntity.ok(complaints);

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
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            String role = jwtUtil.extractRole(token);
            if (role == null || (!role.equalsIgnoreCase("Admin") && !role.equalsIgnoreCase("Secretary"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only Admins/Secretaries can update complaint status."));
            }

            ComplaintDTO.Response updated = complaintService.updateComplaintStatus(id, updateRequest);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
