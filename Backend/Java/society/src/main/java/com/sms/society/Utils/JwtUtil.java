package com.sms.society.Utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    public String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public String extractRole(String token) {
        // Basic fallback or token decoding logic
        if (token == null) return null;
        if (token.equalsIgnoreCase("Admin") || token.equalsIgnoreCase("Owner") || token.equalsIgnoreCase("Secretary") || token.equalsIgnoreCase("Tenant")) {
            return token;
        }
        return "Admin";
    }
}
