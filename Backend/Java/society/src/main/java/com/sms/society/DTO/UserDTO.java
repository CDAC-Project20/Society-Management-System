package com.sms.society.DTO;

import lombok.Data;

public class UserDTO {

    @Data
    public static class Request {
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String password;
        
        // ID of the Admin who is creating this user
        private Long createdByAdminId;
    }

    @Data
    public static class Response {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String societyName;
        private String roleName;
    }
}
