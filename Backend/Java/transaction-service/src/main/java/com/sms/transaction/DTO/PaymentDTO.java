package com.sms.transaction.DTO;

import lombok.Data;

import java.sql.Timestamp;

public class PaymentDTO {

    @Data
    public static class Request {
        private Long paidById;
        private Long flatId;
        private Long societyId;
        private Double amount;
        private String paymentMode;
        private String transactionId;
        private String purpose;
    }

    @Data
    public static class StatusUpdateRequest {
        private String status;
    }

    @Data
    public static class Response {
        private Long id;
        private Long paidById;
        private String paidByName;
        private String paidByEmail;
        private Long flatId;
        private String flatNumber;
        private Long societyId;
        private String societyName;
        private Double amount;
        private String paymentMode;
        private String transactionId;
        private String purpose;
        private String receiptPath;
        private Timestamp paymentDate;
        private String status;
        private Timestamp createdAt;
    }
}
