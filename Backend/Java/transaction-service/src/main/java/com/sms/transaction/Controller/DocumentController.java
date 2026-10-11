package com.sms.transaction.Controller;

import com.sms.transaction.DTO.DocumentDTO;
import com.sms.transaction.Service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/documents", "/api/document"})
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedById") Long uploadedById,
            @RequestParam(value = "societyId", required = false) Long societyId,
            @RequestParam(value = "flatId", required = false) Long flatId,
            @RequestParam(value = "documentName", required = false) String documentName,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "accessScope", required = false) String accessScope,
            @RequestParam(value = "description", required = false) String description) {

        try {
            DocumentDTO.Response response = documentService.uploadDocument(
                    file, societyId, flatId, uploadedById, documentName, documentType, accessScope, description
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<?> getDocumentsBySociety(
            @PathVariable Long societyId,
            @RequestParam(value = "scope", required = false) String scope) {
        try {
            List<DocumentDTO.Response> documents = documentService.getDocumentsBySociety(societyId, scope);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/flat/{flatId}")
    public ResponseEntity<?> getDocumentsByFlat(@PathVariable Long flatId) {
        try {
            List<DocumentDTO.Response> documents = documentService.getDocumentsByFlat(flatId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDocumentsByUser(@PathVariable Long userId) {
        try {
            List<DocumentDTO.Response> documents = documentService.getDocumentsByUser(userId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDocuments() {
        try {
            List<DocumentDTO.Response> documents = documentService.getAllDocuments();
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long id) {
        try {
            DocumentDTO.Response document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/file/{fileName:.+}")
    public ResponseEntity<?> getDocumentFile(@PathVariable String fileName) {
        try {
            byte[] fileData = documentService.getDocumentFileBytes(fileName);
            MediaType mediaType = documentService.getMediaTypeForFileName(fileName);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<?> downloadDocumentFile(@PathVariable String fileName) {
        try {
            byte[] fileData = documentService.getDocumentFileBytes(fileName);
            MediaType mediaType = documentService.getMediaTypeForFileName(fileName);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(
            @PathVariable Long id,
            @RequestParam(value = "userId", required = false) Long userId) {
        try {
            documentService.deleteDocument(id, userId);
            return ResponseEntity.ok(Map.of("message", "Document deleted successfully", "id", id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
