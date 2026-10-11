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

    public User registerOwner(UserDTO.Request requestDTO) throws Exception {  
       
       
        // 1. Check if user already exists
        if(userRepo.findByEmail(requestDTO.getEmail()).isPresent()) {
            throw new Exception("User with email " + requestDTO.getEmail() + " already exists.");
        }

        // 2. Fetch the Admin who is making this request
        User adminUser = userRepo.findById(requestDTO.getCreatedByAdminId())
            .orElseThrow(() -> new Exception("Admin user not found."));
       

        // 3. Create the new Owner User
        User newUser = new User();
        newUser.setFirstName(requestDTO.getFirstName());
        newUser.setLastName(requestDTO.getLastName());
        newUser.setEmail(requestDTO.getEmail());
        newUser.setPhoneNumber(requestDTO.getPhoneNumber());
        newUser.setPassword(requestDTO.getPassword());
        
        // 4. AUTOMATICALLY ASSIGN THE SOCIETY from the Admin
        newUser.setSociety(adminUser.getSociety());
        
        // 5. Assign the OWNER role
        Role ownerRole = roleRepo.findByRoleName("Owner")
            .orElseThrow(() -> new Exception("Role 'Owner' not found in database."));
        newUser.setRole(ownerRole);

        // 6. Save and return
        return userRepo.save(newUser);
    }
}
