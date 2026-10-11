package com.sms.society.Service;

import com.sms.society.DTO.ComplaintDTO;
import com.sms.society.Entities.Complaint;
import com.sms.society.Entities.User;
import com.sms.society.Repository.ComplaintRepository;
import com.sms.society.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ComplaintDTO.Response> getComplaintsBySociety(Long societyId) {
        List<Complaint> complaints = complaintRepository.findBySocietyIdOrderByIdDesc(societyId);
        return complaints.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ComplaintDTO.Response updateComplaintStatus(Long complaintId, ComplaintDTO.StatusUpdateRequest request) throws Exception {
        Complaint complaint = complaintRepository.findById(complaintId)
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

        Complaint updated = complaintRepository.save(complaint);
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
