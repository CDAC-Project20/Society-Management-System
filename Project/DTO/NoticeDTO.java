package com.sms.society.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

public class NoticeDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Long societyId;
        private String title;
        private String description;
        private Long publishedById;
        private String expiryDateStr; // e.g. "2026-08-31" or "2026-08-31T23:59:59"
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
        private Timestamp expiryDate;
        private boolean isExpired;
    }
}
