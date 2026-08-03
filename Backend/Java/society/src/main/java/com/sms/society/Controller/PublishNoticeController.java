package com.sms.society.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sms.society.DTO.NoticeDTO;
import com.sms.society.Service.PublishNoticeService;

@RestController
@RequestMapping(value = {"/api/society/secretary/notices", "/api/society/notices", "/secretary/notices"})
@CrossOrigin(origins = "*")
public class PublishNoticeController {
    
    @Autowired
    private PublishNoticeService publishNoticeService;

    @PostMapping("/publish")
    public ResponseEntity<?> publishNotice(@RequestBody NoticeDTO.ReqNotice reqNotice) {
        try {
            NoticeDTO.ResNotice resNotice = publishNoticeService.publishNotice(reqNotice);
            return ResponseEntity.status(HttpStatus.CREATED).body(resNotice);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}