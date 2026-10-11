package com.sms.society.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

public class ComplaintDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long societyId;
        private Long flatId;
        private Long raisedById;
        private String title;
        private String description;
        private String category;
        private String priority;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest {
        private String status;
        private Long assignedToId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long societyId;
        private String societyName;
        private Long flatId;
        private String flatNumber;
        private Long raisedById;
        private String raisedByName;
        private String raisedByEmail;
        private String title;
        private String description;
        private String category;
        private String priority;
        private String status;
        private Long assignedToId;
        private String assignedToName;
        private Timestamp createdAt;
        private Timestamp resolvedAt;
    }
}
