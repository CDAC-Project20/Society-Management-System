package com.sms.society.DTO;

import lombok.Data;

public class FlatDTO {

    @Data
    public static class Request {
        private String flatNumber;
        private Integer floorNumber;
        private String flatType; // e.g. "2BHK", "3BHK"
        private String status;   // Optional, defaults to "Vacant" if not provided
        private Long ownerId;    // Mandatory: ID of the resident/owner assigned to this flat
        private Long tenantId;   // Optional: ID of the tenant residing in this flat
        
        // ID of the Secretary (Admin) who is creating this flat
        private Long secretaryId;
    }

    @Data
    public static class Response {
        private Long id;
        private String flatNumber;
        private Integer floorNumber;
        private String flatType;
        private String status;
        private Long societyId;
        private String societyName;
        private Long ownerId;
        private String ownerName;
        private Long tenantId;
        private String tenantName;
    }
}
