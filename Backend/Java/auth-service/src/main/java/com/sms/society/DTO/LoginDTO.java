package com.sms.society.DTO;

import lombok.Data;

public class LoginDTO {
    
    @Data
    public static class Request {
        private String email;
        private String username;
        private String password;

        public String getEmail() {
            return email != null && !email.isEmpty() ? email : username;
        }
    }

    @Data
    public static class Response {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String username;
        private String roleName;
        private Integer role;
        private String societyName;
        private String token;
        private Object user;
    }
}
