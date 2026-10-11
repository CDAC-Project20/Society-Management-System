package com.sms.transaction.Service;

import com.sms.transaction.DTO.PaymentDTO;
import com.sms.transaction.Entities.Flat;
import com.sms.transaction.Entities.Payment;
import com.sms.transaction.Entities.Society;
import com.sms.transaction.Entities.User;
import com.sms.transaction.Repository.FlatRepository;
import com.sms.transaction.Repository.PaymentRepository;
import com.sms.transaction.Repository.SocietyRepository;
import com.sms.transaction.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private FlatRepository flatRepository;

    private static final String UPLOAD_DIR = "uploads" + File.separator + "receipts";

    public PaymentDTO.Response uploadPayment(MultipartFile file, Long paidById, Long flatId, Long societyId,
                                              Double amount, String paymentMode, String transactionId,
                                              String purpose) throws Exception {

        // 1. Fetch User (Owner / Tenant)
        User owner = userRepository.findById(paidById)
                .orElseThrow(() -> new Exception("User not found with ID: " + paidById));

        // 2. Determine Society
        Society society = null;
        if (societyId != null) {
            society = societyRepository.findById(societyId).orElse(null);
        }
        if (society == null) {
            society = owner.getSociety();
        }

        // 3. Determine Flat
        Flat flat = null;
        if (flatId != null) {
            flat = flatRepository.findById(flatId).orElse(null);
        }

        // 4. Store uploaded file if present
        String receiptFileName = null;
        if (file != null && !file.isEmpty()) {
            File uploadFolder = new File(UPLOAD_DIR);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            receiptFileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path targetPath = Paths.get(UPLOAD_DIR).resolve(receiptFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        // 5. Create Payment Entity
        Payment payment = new Payment();
        payment.setPaidBy(owner);
        payment.setSociety(society);
        payment.setFlat(flat);
        payment.setAmount(amount != null ? amount : 0.0);
        payment.setPaymentMode(paymentMode);
        payment.setTransactionId(transactionId);
        payment.setPurpose(purpose);
        payment.setReceiptPath(receiptFileName);
        
        Timestamp now = new Timestamp(System.currentTimeMillis());
        payment.setPaymentDate(now);
        payment.setCreatedAt(now);
        payment.setStatus("Submitted");

        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponseDTO(savedPayment);
    }

    public List<PaymentDTO.Response> getPaymentsByOwner(Long ownerId) {
        return paymentRepository.findByPaidByIdOrderByPaymentDateDesc(ownerId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO.Response> getPaymentsBySociety(Long societyId) {
        return paymentRepository.findBySocietyIdOrderByPaymentDateDesc(societyId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO.Response> getPaymentsByFlat(Long flatId) {
        return paymentRepository.findByFlatIdOrderByPaymentDateDesc(flatId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO.Response> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO.Response updatePaymentStatus(Long paymentId, String status) throws Exception {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new Exception("Payment not found with ID: " + paymentId));
        payment.setStatus(status);
        Payment updated = paymentRepository.save(payment);
        return mapToResponseDTO(updated);
    }

    public byte[] getReceiptFileBytes(String fileName) throws IOException {
        Path path = Paths.get(UPLOAD_DIR).resolve(fileName);
        if (!Files.exists(path)) {
            throw new IOException("Receipt file not found: " + fileName);
        }
        return Files.readAllBytes(path);
    }

    private PaymentDTO.Response mapToResponseDTO(Payment payment) {
        PaymentDTO.Response dto = new PaymentDTO.Response();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMode(payment.getPaymentMode());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPurpose(payment.getPurpose());
        dto.setReceiptPath(payment.getReceiptPath());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setStatus(payment.getStatus());
        dto.setCreatedAt(payment.getCreatedAt());

        if (payment.getPaidBy() != null) {
            dto.setPaidById(payment.getPaidBy().getId());
            dto.setPaidByName(payment.getPaidBy().getFirstName() + " " +
                    (payment.getPaidBy().getLastName() != null ? payment.getPaidBy().getLastName() : ""));
            dto.setPaidByEmail(payment.getPaidBy().getEmail());
        }

        if (payment.getFlat() != null) {
            dto.setFlatId(payment.getFlat().getId());
            dto.setFlatNumber(payment.getFlat().getFlatNumber());
        }

        if (payment.getSociety() != null) {
            dto.setSocietyId(payment.getSociety().getId());
            dto.setSocietyName(payment.getSociety().getSocietyName());
        }

        return dto;
    }
}
