package com.sms.society.Controller;

import java.util.HashMap;
import java.util.Map;

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

@RestController
@RequestMapping(value = {"/api/auth", "/auth", "/"})
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private LoginService loginService;

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
            responseDTO.setUsername(user.getEmail());
            
            int roleId = 1;
            String roleName = "SuperAdmin";
            if (user.getRole() != null) {
                roleName = user.getRole().getRoleName();
                roleId = user.getRole().getId() != null ? user.getRole().getId().intValue() : 1;
            }
            responseDTO.setRoleName(roleName);
            responseDTO.setRole(roleId);
            
            if (user.getSociety() != null) {
                responseDTO.setSocietyName(user.getSociety().getSocietyName());
            }

            responseDTO.setToken("jwt-token-" + user.getId() + "-" + System.currentTimeMillis());

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("email", user.getEmail());
            userMap.put("username", user.getEmail());
            userMap.put("role", roleId);
            userMap.put("roleName", roleName);
            if (user.getSociety() != null) {
                userMap.put("societyName", user.getSociety().getSocietyName());
            }
            responseDTO.setUser(userMap);

            // Return the safe DTO to the frontend
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}