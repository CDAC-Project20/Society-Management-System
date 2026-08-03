package com.sms.society.Entities;

import java.sql.Timestamp;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name="complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "SocietyId", referencedColumnName = "Id", nullable = false)
    private Society society;

    @ManyToOne
    @JoinColumn(name = "FlatId", referencedColumnName = "Id", nullable = false)
    private Flat flat;

    @ManyToOne
    @JoinColumn(name = "RaisedBy", referencedColumnName = "Id", nullable = false)
    private User raisedBy;

    @Column(name = "Title", nullable = false, length = 255)
    private String title;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Category", length = 100)
    private String category;

    @Column(name = "Priority")
    private String priority = "Medium";

    @Column(name = "Status")
    private String status = "Open";

    @ManyToOne
    @JoinColumn(name = "AssignedTo", referencedColumnName = "Id")
    private User assignedTo;

    @CreationTimestamp
    @Column(name = "CreatedAt", updatable = false)
    private Timestamp createdAt;

    @Column(name = "ResolvedAt")
    private Timestamp resolvedAt;
}
