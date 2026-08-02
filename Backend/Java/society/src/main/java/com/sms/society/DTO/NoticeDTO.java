package com.sms.society.DTO;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class NoticeDTO {

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
