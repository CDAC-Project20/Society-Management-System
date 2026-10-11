package com.sms.transaction.DTO;

import lombok.Data;

import java.sql.Timestamp;

public class DocumentDTO {

    @Data
    public static class Request {
        private Long societyId;
        private Long flatId;
        private Long uploadedById;
        private String documentName;
        private String documentType;
        private String accessScope;
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private Long societyId;
        private String societyName;
        private Long flatId;
        private String flatNumber;
        private String documentName;
        private String documentType;
        private String accessScope;
        private String documentPath;
        private Long fileSize;
        private String formattedFileSize;
        private String fileType;
        private String description;
        private Long uploadedById;
        private String uploadedByName;
        private String uploadedByEmail;
        private String uploadedByRole;
        private Timestamp uploadedAt;
    }
}
