package com.sms.society.Repository;

import com.sms.society.Entities.Flat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlatRepository extends JpaRepository<Flat, Long> {
    List<Flat> findBySocietyId(Long societyId);
    Optional<Flat> findBySocietyIdAndFlatNumber(Long societyId, String flatNumber);
}

