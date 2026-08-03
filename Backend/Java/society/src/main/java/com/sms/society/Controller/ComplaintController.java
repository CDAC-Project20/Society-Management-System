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

import com.sms.society.DTO.ComplaintDTO;
import com.sms.society.Service.ComplaintService;

@RestController
@RequestMapping(value = {"/api/society/complaints", "/complaints"})
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/raise")
    public ResponseEntity<?> raiseComplaint(@RequestBody ComplaintDTO.Request complaintRequest) {
        try {
            ComplaintDTO.Response response = complaintService.raiseComplaint(complaintRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
