package com.sms.society.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sms.society.DTO.ComplaintDTO;
import com.sms.society.Entities.Complaint;
import com.sms.society.Entities.Flat;
import com.sms.society.Entities.Society;
import com.sms.society.Entities.User;
import com.sms.society.Repository.ComplaintRepo;
import com.sms.society.Repository.FlatRepository;
import com.sms.society.Repository.SocietyRepository;
import com.sms.society.Repository.UserRepository;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepo complaintRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private FlatRepository flatRepository;

    public ComplaintDTO.Response raiseComplaint(ComplaintDTO.Request request) throws Exception {
        
        // 1. Validate User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Exception("User not found"));

        // 2. Validate Role (Only Owner and Tenant can raise complaints)
        String roleName = user.getRole().getRoleName();
        if (!"Owner".equalsIgnoreCase(roleName) && !"Tenant".equalsIgnoreCase(roleName)) {
            throw new Exception("Only Owners and Tenants are allowed to raise a complaint. Current role: " + roleName);
        }

        // 3. Validate Society
        Society society = societyRepository.findById(request.getSocietyId())
                .orElseThrow(() -> new Exception("Society not found"));

        // 4. Validate Flat
        Flat flat = flatRepository.findById(request.getFlatId())
                .orElseThrow(() -> new Exception("Flat not found"));

        // 5. Create Complaint Entity
        Complaint complaint = new Complaint();
        complaint.setRaisedBy(user);
        complaint.setSociety(society);
        complaint.setFlat(flat);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        
        // Use priority from request if present, else it defaults to "Medium" in the entity
        if (request.getPriority() != null && !request.getPriority().trim().isEmpty()) {
            complaint.setPriority(request.getPriority());
        }

        // 6. Save Complaint
        Complaint savedComplaint = complaintRepo.save(complaint);

        // 7. Map to Response DTO
        return mapToResponse(savedComplaint);
    }

    private ComplaintDTO.Response mapToResponse(Complaint complaint) {
        ComplaintDTO.Response response = new ComplaintDTO.Response();
        response.setId(complaint.getId());
        response.setUserId(complaint.getRaisedBy().getId());
        response.setFlatId(complaint.getFlat().getId());
        response.setSocietyId(complaint.getSociety().getId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());
        response.setCategory(complaint.getCategory());
        response.setPriority(complaint.getPriority());
        response.setStatus(complaint.getStatus());
        
        if (complaint.getAssignedTo() != null) {
            response.setAssignedToId(complaint.getAssignedTo().getId());
        }
        
        response.setCreatedAt(complaint.getCreatedAt());
        response.setResolvedAt(complaint.getResolvedAt());
        
        return response;
    }
}
