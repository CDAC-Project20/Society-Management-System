package com.sms.society.Service;

import com.sms.society.Entities.User;
import com.sms.society.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User login(String email, String password) throws Exception {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new Exception("Invalid email or password."));

        String storedPassword = user.getPassword();
        boolean isMatch = false;

        // 1. Check if stored password is a BCrypt hash
        if (storedPassword != null && (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$"))) {
            isMatch = passwordEncoder.matches(password, storedPassword);
        } 
        // 2. Fallback for legacy plain-text passwords in database
        else if (password.equals(storedPassword)) {
            isMatch = true;
            // Upgrade legacy password to BCrypt hash in database
            user.setPassword(passwordEncoder.encode(password));
            userRepo.save(user);
        }

        if (!isMatch) {
            throw new Exception("Invalid email or password.");
        }

        // Check Society Status (SuperAdmin is exempt)
        boolean isSuperAdmin = user.getRole() != null && "SuperAdmin".equalsIgnoreCase(user.getRole().getRoleName());
        if (!isSuperAdmin) {
            if (user.getSociety() == null) {
                throw new Exception("User is not associated with any registered society.");
            }

            String societyStatus = user.getSociety().getStatus();
            if (societyStatus == null || !"APPROVED".equalsIgnoreCase(societyStatus.trim())) {
                if ("PENDING".equalsIgnoreCase(societyStatus)) {
                    throw new Exception("Your society registration is currently pending approval. Please wait for SuperAdmin approval.");
                } else if ("REJECTED".equalsIgnoreCase(societyStatus)) {
                    throw new Exception("Your society registration has been rejected. Login is not allowed.");
                } else {
                    throw new Exception("Your society is not approved for access. Current status: " + societyStatus);
                }
            }
        }

        return user;
    }

}
