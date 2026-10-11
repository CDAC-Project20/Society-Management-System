package com.sms.society.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.sms.society.DTO.UserDTO;
import com.sms.society.Entities.User;
import com.sms.society.Service.UserRegisService;
import com.sms.society.Utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = {"/api/auth/users", "/api/auth", "/users"})
@CrossOrigin(origins = "*")
public class UserRegisController {
    
    @Autowired
    private UserRegisService userRegisService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO.Request userRequest, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }
            
            String role = jwtUtil.extractRole(token);

            User savedUser = userRegisService.registerUser(userRequest, role);
            UserDTO.Response response = userRegisService.mapToResponseDTO(savedUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping(value = {"/society/{societyId}", "/society/{societyId}/all"})
    public ResponseEntity<?> getUsersBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            List<UserDTO.Response> users = userRegisService.getUsersBySociety(societyId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping(value = {"/society/{societyId}/owners", "/owners/society/{societyId}"})
    public ResponseEntity<?> getOwnersBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            List<UserDTO.Response> owners = userRegisService.getOwnersBySociety(societyId);
            return ResponseEntity.ok(owners);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
