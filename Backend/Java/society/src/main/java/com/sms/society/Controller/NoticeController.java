package com.sms.society.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sms.society.DTO.NoticeDTO;
import com.sms.society.Service.NoticeService;
import com.sms.society.Utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = {"/api/society/notices", "/notices", "/secretary/notices", "/api/society/secretary/notices"})
@CrossOrigin(origins = "*")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping(value = {"", "/", "/all"})
    public ResponseEntity<?> getAllNotices(HttpServletRequest request) {
        try {
            List<NoticeDTO.Response> notices = noticeService.getAllNotices();
            return ResponseEntity.ok(notices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getNoticesBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            List<NoticeDTO.Response> notices = noticeService.getNoticesBySociety(societyId);
            return ResponseEntity.ok(notices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = {"/create", "/publish"})
    public ResponseEntity<?> createNotice(@RequestBody NoticeDTO.Request noticeRequest, HttpServletRequest request) {
        try {
            NoticeDTO.Response response = noticeService.createNotice(noticeRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id, HttpServletRequest request) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok(Map.of("message", "Notice deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
