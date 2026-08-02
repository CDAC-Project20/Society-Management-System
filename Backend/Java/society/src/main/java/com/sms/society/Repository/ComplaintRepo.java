package com.sms.society.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sms.society.Entities.Complaint;

@Repository
public interface ComplaintRepo extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySocietyId(Long societyId);
    
    List<Complaint> findByRaisedById(Long userId);
    
    List<Complaint> findByFlatId(Long flatId);
    
    List<Complaint> findBySocietyIdAndStatus(Long societyId, String status);
}
