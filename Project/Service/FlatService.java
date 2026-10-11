package com.sms.society.Service;

import com.sms.society.DTO.FlatDTO;
import com.sms.society.Entities.Flat;
import com.sms.society.Entities.Society;
import com.sms.society.Entities.User;
import com.sms.society.Repository.FlatRepository;
import com.sms.society.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlatService {

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private UserRepository userRepository;

    public FlatDTO.Response createFlatBySecretary(FlatDTO.Request requestDTO) throws Exception {
        // 1. Fetch and validate Secretary User
        User secretary = userRepository.findById(requestDTO.getSecretaryId())
                .orElseThrow(() -> new Exception("Secretary user not found with ID: " + requestDTO.getSecretaryId()));

        Society society = secretary.getSociety();
        if (society == null) {
            throw new Exception("Secretary is not associated with any society.");
        }

        // 2. Check if flat number already exists in this society
        if (flatRepository.findBySocietyIdAndFlatNumber(society.getId(), requestDTO.getFlatNumber()).isPresent()) {
            throw new Exception("Flat number '" + requestDTO.getFlatNumber() + "' already exists in society '" + society.getSocietyName() + "'.");
        }

        // 3. Fetch and validate Owner User
        User owner = userRepository.findById(requestDTO.getOwnerId())
                .orElseThrow(() -> new Exception("Owner user not found with ID: " + requestDTO.getOwnerId()));

        // 4. Optionally fetch Tenant User if provided
        User tenant = null;
        if (requestDTO.getTenantId() != null) {
            tenant = userRepository.findById(requestDTO.getTenantId())
                    .orElseThrow(() -> new Exception("Tenant user not found with ID: " + requestDTO.getTenantId()));
        }

        // 5. Build and save Flat entity
        Flat flat = new Flat();
        flat.setSociety(society);
        flat.setFlatNumber(requestDTO.getFlatNumber());
        flat.setFloorNumber(requestDTO.getFloorNumber());
        flat.setFlatType(requestDTO.getFlatType());
        if (requestDTO.getStatus() != null && !requestDTO.getStatus().trim().isEmpty()) {
            flat.setStatus(requestDTO.getStatus());
        } else {
            flat.setStatus("Vacant");
        }
        flat.setOwner(owner);
        flat.setTenant(tenant);

        Flat savedFlat = flatRepository.save(flat);

        // 6. Map entity to Response DTO
        return mapToResponseDTO(savedFlat);
    }

    public List<FlatDTO.Response> getFlatsBySociety(Long societyId) {
        return flatRepository.findBySocietyId(societyId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private FlatDTO.Response mapToResponseDTO(Flat flat) {
        FlatDTO.Response response = new FlatDTO.Response();
        response.setId(flat.getId());
        response.setFlatNumber(flat.getFlatNumber());
        response.setFloorNumber(flat.getFloorNumber());
        response.setFlatType(flat.getFlatType());
        response.setStatus(flat.getStatus());

        if (flat.getSociety() != null) {
            response.setSocietyId(flat.getSociety().getId());
            response.setSocietyName(flat.getSociety().getSocietyName());
        }

        if (flat.getOwner() != null) {
            response.setOwnerId(flat.getOwner().getId());
            response.setOwnerName(flat.getOwner().getFirstName() + " " + (flat.getOwner().getLastName() != null ? flat.getOwner().getLastName() : ""));
        }

        if (flat.getTenant() != null) {
            response.setTenantId(flat.getTenant().getId());
            response.setTenantName(flat.getTenant().getFirstName() + " " + (flat.getTenant().getLastName() != null ? flat.getTenant().getLastName() : ""));
        }

        return response;
    }
}
