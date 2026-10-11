package com.sms.transaction.Repository;

import com.sms.transaction.Entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPaidByIdOrderByPaymentDateDesc(Long paidById);
    List<Payment> findBySocietyIdOrderByPaymentDateDesc(Long societyId);
    List<Payment> findByFlatIdOrderByPaymentDateDesc(Long flatId);
}

