package com.sms.transaction.Repository;

import com.sms.transaction.Entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findBySocietyIdOrderByUploadedAtDesc(Long societyId);
    List<Document> findBySocietyIdAndAccessScopeOrderByUploadedAtDesc(Long societyId, String accessScope);
    List<Document> findByFlatIdOrderByUploadedAtDesc(Long flatId);
    List<Document> findByUploadedByIdOrderByUploadedAtDesc(Long uploadedById);
    List<Document> findAllByOrderByUploadedAtDesc();
}
