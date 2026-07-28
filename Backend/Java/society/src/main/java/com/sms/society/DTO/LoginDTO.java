package com.sms.society.DTO;

import lombok.Data;

public class LoginDTO {
    
    @Data
    public static class Request {
        private String email;
        private String password;
    }

    @Data
    public static class Response {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String roleName;
        private String societyName;
    }
}
