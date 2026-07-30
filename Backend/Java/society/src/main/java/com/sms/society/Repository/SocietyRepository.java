package com.sms.society.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sms.society.Entities.Society;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {
    Optional<Society> findByContactEmail(String contactEmail);

}
