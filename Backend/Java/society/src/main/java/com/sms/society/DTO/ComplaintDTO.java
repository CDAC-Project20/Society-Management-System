package com.sms.society.DTO;

import java.sql.Timestamp;

import lombok.Data;


@Data
public class ComplaintDTO {
    
    @Data
    public static class Request {
        private Long userId; // The ID of the owner or tenant raising the complaint
        private Long flatId;
        private Long societyId;
        private String title;
        private String description;
        private String category;
        private String priority;
    }

    @Data   
    public static class Response {
        private Long id;
        private Long userId; // Raised by
        private Long flatId;
        private Long societyId;
        private String title;
        private String description;
        private String category;
        private String priority;
        private String status;
        private Long assignedToId;
        private Timestamp createdAt;
        private Timestamp resolvedAt;
    }
}


