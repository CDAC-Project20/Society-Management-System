package com.sms.society.DTO;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class NoticeDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long societyId;
        private String title;
        private String description;
        private Long publishedById;
        private Long userId; // Alias for publishedById
        private String expiryDateStr; // e.g. "2026-08-31" or "2026-08-31T23:59:59"
        private Timestamp publishedDate;
        private Timestamp expiryDate;

        public Long getPublishedById() {
            return publishedById != null ? publishedById : userId;
        }

        public Long getUserId() {
            return userId != null ? userId : publishedById;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long societyId;
        private String societyName;
        private String title;
        private String description;
        private Long publishedById;
        private String publishedByName;
        private Timestamp publishDate;
        private Timestamp publishedDate; // Alias
        private Timestamp expiryDate;
        private boolean isExpired;

        public Timestamp getPublishedDate() {
            return publishedDate != null ? publishedDate : publishDate;
        }

        public void setPublishDate(Timestamp publishDate) {
            this.publishDate = publishDate;
            this.publishedDate = publishDate;
        }

        public void setPublishedDate(Timestamp publishedDate) {
            this.publishedDate = publishedDate;
            this.publishDate = publishedDate;
        }
    }

    // Backward compatibility aliases
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReqNotice {
        private Long societyId;
        private Long userId;
        private String title;
        private String description;
        private Timestamp publishedDate;
        private Timestamp expiryDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResNotice {
        private Long id;
        private Long societyId;
        private String title;
        private String description;
        private Timestamp publishedDate;
        private Timestamp expiryDate;
    }
}
