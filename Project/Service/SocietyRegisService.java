package com.sms.society.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sms.society.Entities.Role;
import com.sms.society.Entities.Society;
import com.sms.society.Entities.User;
import com.sms.society.Repository.RoleRepository;
import com.sms.society.Repository.SocietyRepository;
import com.sms.society.Repository.UserRepository;

@Service
public class SocietyRegisService {

    @Autowired
    SocietyRepository societyRegisRepo;
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    RoleRepository roleRepo;
    
    public Society registerSociety(Society society) throws Exception {        
     
        //Check if a society with this Contact Email already exists
        Optional<Society> societyemail = societyRegisRepo.findByContactEmail(society.getContactEmail());
        
        if (societyemail.isPresent()) {
            throw new Exception("A society with email " + society.getContactEmail() + " already exists.");
        }

        //If validations pass, save the new society
        Society savedSociety = societyRegisRepo.save(society);
        
        // AUTOMATICALLY CREATE THE ADMIN USER FOR THIS SOCIETY
        User adminUser = new User();
        adminUser.setFirstName("Admin"); // Default first name
        adminUser.setLastName(savedSociety.getSocietyName()); // Default last name
        adminUser.setEmail(savedSociety.getContactEmail());
        adminUser.setPassword(savedSociety.getPassword());
        adminUser.setPhoneNumber(savedSociety.getContactPhone());
        adminUser.setSociety(savedSociety);
        
        // Assign the ADMIN role
        Role adminRole = roleRepo.findByRoleName("Admin")
            .orElseThrow(() -> new Exception("Role 'Admin' not found in database."));
        adminUser.setRole(adminRole);
        
        // Save the Admin user
        userRepo.save(adminUser);
        
        return savedSociety;
    }
}
