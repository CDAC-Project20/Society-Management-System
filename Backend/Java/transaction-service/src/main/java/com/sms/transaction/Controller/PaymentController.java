package com.sms.transaction.Controller;

import com.sms.transaction.DTO.PaymentDTO;
import com.sms.transaction.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPayment(
            @RequestParam(value = "receiptFile", required = false) MultipartFile receiptFile,
            @RequestParam("paidById") Long paidById,
            @RequestParam(value = "flatId", required = false) Long flatId,
            @RequestParam(value = "societyId", required = false) Long societyId,
            @RequestParam("amount") Double amount,
            @RequestParam(value = "paymentMode", required = false) String paymentMode,
            @RequestParam(value = "transactionId", required = false) String transactionId,
            @RequestParam(value = "purpose", required = false) String purpose) {

        try {
            PaymentDTO.Response response = paymentService.uploadPayment(
                    receiptFile, paidById, flatId, societyId, amount, paymentMode, transactionId, purpose
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getPaymentsByOwner(@PathVariable Long ownerId) {
        try {
            List<PaymentDTO.Response> payments = paymentService.getPaymentsByOwner(ownerId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getPaymentsBySociety(@PathVariable Long societyId) {
        try {
            List<PaymentDTO.Response> payments = paymentService.getPaymentsBySociety(societyId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/flat/{flatId}")
    public ResponseEntity<?> getPaymentsByFlat(@PathVariable Long flatId) {
        try {
            List<PaymentDTO.Response> payments = paymentService.getPaymentsByFlat(flatId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPayments() {
        try {
            List<PaymentDTO.Response> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody PaymentDTO.StatusUpdateRequest request) {
        try {
            PaymentDTO.Response response = paymentService.updatePaymentStatus(id, request.getStatus());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/receipt/{fileName:.+}")
    public ResponseEntity<?> getReceiptFile(@PathVariable String fileName) {
        try {
            byte[] fileData = paymentService.getReceiptFileBytes(fileName);
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

            String lower = fileName.toLowerCase();
            if (lower.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (lower.endsWith(".pdf")) {
                mediaType = MediaType.APPLICATION_PDF;
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
