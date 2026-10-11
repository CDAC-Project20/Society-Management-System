package com.sms.society.Controller;

import com.sms.society.DTO.NoticeDTO;
import com.sms.society.Service.NoticeService;
import com.sms.society.Utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notices")
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getNoticesBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            List<NoticeDTO.Response> notices = noticeService.getNoticesBySociety(societyId);
            return ResponseEntity.ok(notices);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNotice(@RequestBody NoticeDTO.Request noticeRequest, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            String role = jwtUtil.extractRole(token);
            if (role == null || (!role.equalsIgnoreCase("Admin") && !role.equalsIgnoreCase("Secretary"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only Admins/Secretaries can publish notices."));
            }

            NoticeDTO.Response response = noticeService.createNotice(noticeRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            String role = jwtUtil.extractRole(token);
            if (role == null || (!role.equalsIgnoreCase("Admin") && !role.equalsIgnoreCase("Secretary"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only Admins/Secretaries can delete notices."));
            }

            noticeService.deleteNotice(id);
            return ResponseEntity.ok(Map.of("message", "Notice deleted successfully."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
