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
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "SocietyId", referencedColumnName = "Id", nullable = false)
    private Society society;

    @ManyToOne
    @JoinColumn(name = "FlatId", referencedColumnName = "Id")
    private Flat flat;

    @Column(name = "DocumentName", nullable = false, length = 255)
    private String documentName;

    @Column(name = "DocumentType", length = 100)
    private String documentType;

    @Column(name = "AccessScope", length = 20)
    private String accessScope = "SOCIETY";

    @Column(name = "DocumentPath", nullable = false, length = 500)
    private String documentPath;

    @Column(name = "FileSize")
    private Long fileSize = 0L;

    @Column(name = "FileType", length = 50)
    private String fileType;

    @Column(name = "Description", length = 500)
    private String description;

    @ManyToOne
    @JoinColumn(name = "UploadedBy", referencedColumnName = "Id", nullable = false)
    private User uploadedBy;

    @Column(name = "UploadedAt")
    private Timestamp uploadedAt;
}
