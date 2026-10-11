package com.sms.society.Repository;

import com.sms.society.Entities.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySocietyIdOrderByIdDesc(Long societyId);
    List<Complaint> findByFlatIdOrderByIdDesc(Long flatId);
    List<Complaint> findByRaisedByIdOrderByIdDesc(Long raisedById);
}
