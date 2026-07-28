package com.sms.society.DTO;

import lombok.Data;

public class SocietyDTO {
    
    @Data
    public static class Request {
        private String societyName;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private String contactEmail;
        private String contactPhone;
        private String password;
    }

    @Data
    public static class Response {
        private Long id;
        private String societyName;    
        private String contactEmail;
        private String status;
    }
}
