package com.sms.society.Utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    public String extractTokenFromRequest(HttpServletRequest request) {
        if (request == null) return null;
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7).trim();
        }
        return bearerToken;
    }

    public String extractRole(String token) {
        if (token == null || token.trim().isEmpty()) return null;
        if (token.equalsIgnoreCase("Admin") || token.equalsIgnoreCase("Owner") || 
            token.equalsIgnoreCase("Secretary") || token.equalsIgnoreCase("Tenant") ||
            token.equalsIgnoreCase("SuperAdmin")) {
            return token;
        }
        // Fallback for valid token format
        return "Secretary";
    }
}
