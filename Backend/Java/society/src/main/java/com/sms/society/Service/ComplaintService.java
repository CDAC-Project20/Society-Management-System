package com.sms.society.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<ComplaintDTO.Response> getComplaintsBySociety(Long societyId) {
        List<Complaint> complaints = complaintRepo.findBySocietyIdOrderByIdDesc(societyId);
        return complaints.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ComplaintDTO.Response raiseComplaint(ComplaintDTO.Request request) throws Exception {
        Long userId = request.getRaisedById();
        if (userId == null) {
            throw new Exception("User ID is required to raise a complaint.");
        }

        // 1. Validate User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));

        // 2. Validate Role (Only Owner and Tenant can raise complaints)
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "";
        if (!"Owner".equalsIgnoreCase(roleName) && !"Tenant".equalsIgnoreCase(roleName)) {
            throw new Exception("Only Owners and Tenants are allowed to raise a complaint. Current role: " + roleName);
        }

        // 3. Validate Society
        Long societyId = request.getSocietyId();
        if (societyId == null && user.getSociety() != null) {
            societyId = user.getSociety().getId();
        }
        if (societyId == null) {
            throw new Exception("Society ID is required.");
        }
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new Exception("Society not found"));

        // 4. Resolve Flat automatically using User ID (no flatId required)
        Flat flat = null;
        if (request.getFlatId() != null) {
            flat = flatRepository.findById(request.getFlatId()).orElse(null);
        }

        if (flat == null) {
            // Auto-resolve flat linked to this user as Tenant or Owner
            List<Flat> userFlats = "Tenant".equalsIgnoreCase(roleName)
                    ? flatRepository.findByTenantId(userId)
                    : flatRepository.findByOwnerId(userId);

            if (userFlats != null && !userFlats.isEmpty()) {
                flat = userFlats.get(0);
            }
        }

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

    public ComplaintDTO.Response updateComplaintStatus(Long complaintId, ComplaintDTO.StatusUpdateRequest request) throws Exception {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new Exception("Complaint not found with ID: " + complaintId));

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            complaint.setStatus(request.getStatus());

            if ("Resolved".equalsIgnoreCase(request.getStatus())) {
                complaint.setResolvedAt(new Timestamp(System.currentTimeMillis()));
            } else if ("Open".equalsIgnoreCase(request.getStatus()) || "In Progress".equalsIgnoreCase(request.getStatus())) {
                complaint.setResolvedAt(null);
            }
        }

        if (request.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedToId()).orElse(null);
            complaint.setAssignedTo(assignedUser);
        }

        Complaint updated = complaintRepo.save(complaint);
        return mapToResponse(updated);
    }

    private ComplaintDTO.Response mapToResponse(Complaint c) {
        ComplaintDTO.Response resp = new ComplaintDTO.Response();
        resp.setId(c.getId());
        if (c.getSociety() != null) {
            resp.setSocietyId(c.getSociety().getId());
            resp.setSocietyName(c.getSociety().getSocietyName());
        }
        if (c.getFlat() != null) {
            resp.setFlatId(c.getFlat().getId());
            resp.setFlatNumber(c.getFlat().getFlatNumber());
        }
        if (c.getRaisedBy() != null) {
            resp.setRaisedById(c.getRaisedBy().getId());
            String fullName = c.getRaisedBy().getFirstName() +
                    (c.getRaisedBy().getLastName() != null ? " " + c.getRaisedBy().getLastName() : "");
            resp.setRaisedByName(fullName);
            resp.setRaisedByEmail(c.getRaisedBy().getEmail());
        }
        resp.setTitle(c.getTitle());
        resp.setDescription(c.getDescription());
        resp.setCategory(c.getCategory());
        resp.setPriority(c.getPriority());
        resp.setStatus(c.getStatus());

        if (c.getAssignedTo() != null) {
            resp.setAssignedToId(c.getAssignedTo().getId());
            String assignedName = c.getAssignedTo().getFirstName() +
                    (c.getAssignedTo().getLastName() != null ? " " + c.getAssignedTo().getLastName() : "");
            resp.setAssignedToName(assignedName);
        }

        resp.setCreatedAt(c.getCreatedAt());
        resp.setResolvedAt(c.getResolvedAt());
        return resp;
    }
}
