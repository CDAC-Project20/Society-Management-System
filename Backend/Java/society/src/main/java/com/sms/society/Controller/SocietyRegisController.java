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

import com.sms.society.DTO.SocietyDTO;
import com.sms.society.Entities.Society;
import com.sms.society.Service.SocietyRegisService;

@RestController
@RequestMapping(value = {"/api/society/societies", "/api/society", "/societies"})
@CrossOrigin(origins = "*")
public class SocietyRegisController {

    @Autowired
    private SocietyRegisService societyRegisService;

    @PostMapping("/register")
    public ResponseEntity<?> registerSociety(@RequestBody SocietyDTO.Request societyReqDTO) {
        try {         
            Society societyEntity = new Society();
        
            societyEntity.setSocietyName(societyReqDTO.getSocietyName());           
            societyEntity.setAddress(societyReqDTO.getAddress());
            societyEntity.setCity(societyReqDTO.getCity());
            societyEntity.setState(societyReqDTO.getState());
            societyEntity.setPincode(societyReqDTO.getPincode());
            societyEntity.setContactEmail(societyReqDTO.getContactEmail());
            societyEntity.setContactPhone(societyReqDTO.getContactPhone());
            societyEntity.setPassword(societyReqDTO.getPassword());
            

            // Save the entity to the database using your service
            societyRegisService.registerSociety(societyEntity);
            
            // Return only the success message
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Registration successful. Your application status is Pending, wait for Approval."
            ));
            
        } catch (Exception e) {
            // If it fails (e.g., duplicate registration number), return a 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    @org.springframework.web.bind.annotation.GetMapping
    public ResponseEntity<?> getAllSocieties() {
        try {
            return ResponseEntity.ok(societyRegisService.getAllSocieties());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}/status")
    public ResponseEntity<?> updateSocietyStatus(
            @org.springframework.web.bind.annotation.PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            societyRegisService.updateSocietyStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
