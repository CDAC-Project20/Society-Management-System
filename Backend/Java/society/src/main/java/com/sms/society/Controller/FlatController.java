package com.sms.society.Controller;

import com.sms.society.DTO.FlatDTO;
import com.sms.society.Service.FlatService;
import com.sms.society.Utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = {"/api/society/flats", "/flats"})
@CrossOrigin(origins = "*")
public class FlatController {

    @Autowired
    private FlatService flatService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<?> createFlat(@RequestBody FlatDTO.Request flatRequest, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            String role = jwtUtil.extractRole(token);
            if (role == null || (!role.equalsIgnoreCase("Admin") && !role.equalsIgnoreCase("Secretary"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Only Admins/Secretaries can create flats."));
            }

            FlatDTO.Response response = flatService.createFlatBySecretary(flatRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getFlatsBySociety(@PathVariable Long societyId, HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing Authorization token."));
            }

            List<FlatDTO.Response> flats = flatService.getFlatsBySociety(societyId);
            return ResponseEntity.ok(flats);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
