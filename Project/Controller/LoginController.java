package com.sms.society.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sms.society.DTO.LoginDTO;
import com.sms.society.Entities.User;
import com.sms.society.Service.LoginService;
import com.sms.society.Utils.JwtUtil;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO.Request loginRequest) {

        try {            
            // Find the user using the Service
            User user = loginService.login(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );

            // Convert the database User Entity to a safe LoginDTO.Response
            LoginDTO.Response responseDTO = new LoginDTO.Response();

            responseDTO.setId(user.getId());
            responseDTO.setFirstName(user.getFirstName());
            responseDTO.setLastName(user.getLastName());
            responseDTO.setEmail(user.getEmail());
            
            if (user.getRole() != null) {
                responseDTO.setRoleName(user.getRole().getRoleName());
            }
            
            if (user.getSociety() != null) {
                responseDTO.setSocietyName(user.getSociety().getSocietyName());
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user);
            responseDTO.setToken(token);

            // Return the safe DTO to the frontend
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(java.util.Map.of("message", e.getMessage()));
        }
    }
}