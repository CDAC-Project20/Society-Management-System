package com.sms.society.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    PasswordEncoder passwordEncoder;
    
    public Society registerSociety(Society society) throws Exception {        
     
        //Check if a society with this Contact Email already exists
        Optional<Society> societyemail = societyRegisRepo.findByContactEmail(society.getContactEmail());
        
        if (societyemail.isPresent()) {
            throw new Exception("A society with email " + society.getContactEmail() + " already exists.");
        }

        // Encode password before saving
        String rawPassword = society.getPassword();
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            society.setPassword(passwordEncoder.encode(rawPassword));
        }

        //If validations pass, save the new society
        Society savedSociety = societyRegisRepo.save(society);
        
        // AUTOMATICALLY CREATE THE ADMIN USER FOR THIS SOCIETY
        User adminUser = new User();
        adminUser.setFirstName("Admin"); // Default first name
        adminUser.setLastName(savedSociety.getSocietyName()); // Default last name
        adminUser.setEmail(savedSociety.getContactEmail());
        adminUser.setPassword(savedSociety.getPassword()); // Already BCrypt encoded
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

    public java.util.List<com.sms.society.DTO.SocietyDTO.Response> getAllSocieties() {
        return societyRegisRepo.findAll().stream().map(society -> {
            com.sms.society.DTO.SocietyDTO.Response dto = new com.sms.society.DTO.SocietyDTO.Response();
            dto.setId(society.getId());
            dto.setSocietyName(society.getSocietyName());
            dto.setRegistrationNumber(society.getRegistrationNumber());
            dto.setAddress(society.getAddress());
            dto.setCity(society.getCity());
            dto.setState(society.getState());
            dto.setPincode(society.getPincode());
            dto.setContactEmail(society.getContactEmail());
            dto.setContactPhone(society.getContactPhone());
            dto.setStatus(society.getStatus());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    public void updateSocietyStatus(Long societyId, String status) throws Exception {
        Society society = societyRegisRepo.findById(societyId)
            .orElseThrow(() -> new Exception("Society not found"));
        society.setStatus(status);
        societyRegisRepo.save(society);
    }
}
