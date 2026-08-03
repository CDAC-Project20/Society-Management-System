package com.sms.society.Service;

import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sms.society.DTO.UserDTO;
import com.sms.society.Entities.Role;
import com.sms.society.Entities.User;
import com.sms.society.Repository.RoleRepository;
import com.sms.society.Repository.UserRepository;

@Service
public class UserRegisService {

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private RoleRepository roleRepo;

    public User registerUser(UserDTO.Request requestDTO, String creatorRole) throws Exception {  
       
        // 1. Check if user already exists
        if (userRepo.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new Exception("User with email " + requestDTO.getEmail() + " already exists.");
        }

        // 2. Fetch the Creator (Owner, Secretary, or Admin) who is making this request
        if (requestDTO.getCreatedByAdminId() == null) {
            throw new Exception("Creator user ID is required.");
        }

        User creatorUser = userRepo.findById(requestDTO.getCreatedByAdminId())
            .orElseThrow(() -> new Exception("Creator user not found."));

        // Determine creator's role from the fetched creatorUser entity (or fallback to creatorRole)
        String actualCreatorRole = null;
        if (creatorUser.getRole() != null && creatorUser.getRole().getRoleName() != null) {
            actualCreatorRole = creatorUser.getRole().getRoleName();
        } else if (creatorRole != null && !creatorRole.trim().isEmpty()) {
            actualCreatorRole = creatorRole;
        }

        // 3. Assign the appropriate role based on who created them:
        // Owner -> Tenant
        // Secretary or Admin -> Owner
        String roleNameToAssign;
        if ("Owner".equalsIgnoreCase(actualCreatorRole)) {
            roleNameToAssign = "Tenant";
        } else if ("Secretary".equalsIgnoreCase(actualCreatorRole) || "Admin".equalsIgnoreCase(actualCreatorRole)) {
            roleNameToAssign = "Owner";
        } else {
            throw new Exception("Only Owner, Secretary, or Admin can register new users. Current role: " + actualCreatorRole);
        }

        // 4. Create the new User
        User newUser = new User();
        newUser.setFirstName(requestDTO.getFirstName());
        newUser.setLastName(requestDTO.getLastName());
        newUser.setEmail(requestDTO.getEmail());
        newUser.setPhoneNumber(requestDTO.getPhoneNumber());
        newUser.setPassword(requestDTO.getPassword());
        newUser.setIsActive(true);
        newUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        
        // 5. Automatically assign the society from the Creator
        if (creatorUser.getSociety() != null) {
            newUser.setSociety(creatorUser.getSociety());
        }

        Role role = roleRepo.findByRoleName(roleNameToAssign)
            .orElseThrow(() -> new RuntimeException("Role not found: " + roleNameToAssign));
        
        newUser.setRole(role);
                
        // 6. Save and return
        return userRepo.save(newUser);
    }
}
