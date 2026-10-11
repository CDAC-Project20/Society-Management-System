package com.sms.society.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sms.society.Entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPassword(String email, String password);
    Optional<User> findByEmail(String email);
    List<User> findBySocietyId(Long societyId);
    List<User> findBySocietyIdAndRole_RoleNameIgnoreCase(Long societyId, String roleName);
}
