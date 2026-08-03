package com.sms.society.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sms.society.Entities.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long>{

    Optional<Notice> findById(Long id);
    
    List<Notice> findBySocietyId(Long societyId);
}
