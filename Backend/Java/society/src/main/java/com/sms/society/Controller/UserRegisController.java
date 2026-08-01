package com.sms.society.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserRegisController {
    
    @Autowired
    private UserRegisService userRegisService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerOwner(@RequestBody UserDTO.Request userRequest, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }
            
            String role = jwtUtil.extractRole(token);
            if (role == null || (!role.equals("Admin") && !role.equals("Owner"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only Admins can register new users."));
            }

            User savedUser = userRegisService.registerUser(userRequest, role);
            
            // Convert to safe Response DTO
            UserDTO.Response response = new UserDTO.Response();
            response.setId(savedUser.getId());
            response.setFirstName(savedUser.getFirstName());
            response.setLastName(savedUser.getLastName());
            response.setEmail(savedUser.getEmail());
            
            if (savedUser.getSociety() != null) {
                response.setSocietyName(savedUser.getSociety().getSocietyName());
            }
            // if (savedUser.getRole() != null) {
            //     response.setRoleName(savedUser.getRole().getRoleName());
            // }

            if(role.equals("Admin")){
                response.setRoleName("Owner");
            }
            if(role.equals("Owner")){
                response.setRoleName("Tenant");
            }
            
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
