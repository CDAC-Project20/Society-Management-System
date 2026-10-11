package com.sms.society.DTO;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ComplaintDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long userId; // For backward compatibility with owner/tenant raise complaint
        private Long raisedById;
        private Long flatId;
        private Long societyId;
        private String title;
        private String description;
        private String category;
        private String priority;

        public Long getRaisedById() {
            return raisedById != null ? raisedById : userId;
        }

        public Long getUserId() {
            return userId != null ? userId : raisedById;
        }
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
        private Long userId; // Alias for raisedById
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

        public void setRaisedById(Long raisedById) {
            this.raisedById = raisedById;
            this.userId = raisedById;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
            if (this.raisedById == null) {
                this.raisedById = userId;
            }
        }
    }
}


