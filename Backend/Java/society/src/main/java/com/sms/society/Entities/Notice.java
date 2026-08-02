package com.sms.society.Entities;

import java.sql.Timestamp;

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

@Entity
@Table(name="Notices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "SocietyId", referencedColumnName = "Id", nullable = false)
    private Society society;

    @Column(name = "Title", nullable = false, length = 255)
    private String title;

    @Column(name = "Description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "PublishedDate")
    private Timestamp publishedDate;

    @Column(name = "ExpiryDate")
    private Timestamp expiryDate;

    @ManyToOne
    @JoinColumn(name = "PublishedBy", referencedColumnName = "Id", nullable = false)
    private User publishedBy;
}