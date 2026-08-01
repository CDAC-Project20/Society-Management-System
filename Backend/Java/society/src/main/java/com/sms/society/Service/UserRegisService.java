package com.sms.society.Service;

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
        if(userRepo.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new Exception("User with email " + requestDTO.getEmail() + " already exists.");
        }

        // 2. Fetch the Creator (Admin or Owner) who is making this request
        User creatorUser = userRepo.findById(requestDTO.getCreatedByAdminId())
            .orElseThrow(() -> new Exception("Creator user not found."));
       

        // 3. Create the new User
        User newUser = new User();
        newUser.setFirstName(requestDTO.getFirstName());
        newUser.setLastName(requestDTO.getLastName());
        newUser.setEmail(requestDTO.getEmail());
        newUser.setPhoneNumber(requestDTO.getPhoneNumber());
        newUser.setPassword(requestDTO.getPassword());
        
        // 4. AUTOMATICALLY ASSIGN THE SOCIETY from the Creator
        newUser.setSociety(creatorUser.getSociety());
        

        // 5. Assign the appropriate role based on who created them
        final String roleNameToAssign =
        "Owner".equalsIgnoreCase(creatorRole) ? "Tenant" : "Owner";

    
        Role role = roleRepo.findByRoleName(roleNameToAssign)
        .orElseThrow(() ->
                new RuntimeException("Role not found: " + roleNameToAssign));
        
                newUser.setRole(role);
                
        // 6. Save and return
        return userRepo.save(newUser);
    }
}
