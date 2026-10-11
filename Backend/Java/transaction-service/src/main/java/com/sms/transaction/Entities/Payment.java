package com.sms.transaction.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SocietyId", referencedColumnName = "Id")
    private Society society;

    @ManyToOne
    @JoinColumn(name = "FlatId", referencedColumnName = "Id")
    private Flat flat;

    @ManyToOne
    @JoinColumn(name = "PaidBy", referencedColumnName = "Id", nullable = false)
    private User paidBy;

    @Column(name = "Amount", nullable = false)
    private Double amount;

    @Column(name = "PaymentMode", length = 50)
    private String paymentMode;

    @Column(name = "TransactionId", length = 100)
    private String transactionId;

    @Column(name = "Purpose", length = 255)
    private String purpose;

    @Column(name = "ReceiptPath", length = 500)
    private String receiptPath;

    @Column(name = "PaymentDate")
    private Timestamp paymentDate;

    @Column(name = "Status", length = 50)
    private String status = "Submitted";

    @Column(name = "CreatedAt")
    private Timestamp createdAt;
}
