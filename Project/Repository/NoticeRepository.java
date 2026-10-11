package com.sms.society.Repository;

import com.sms.society.Entities.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findBySocietyIdOrderByIdDesc(Long societyId);
}
