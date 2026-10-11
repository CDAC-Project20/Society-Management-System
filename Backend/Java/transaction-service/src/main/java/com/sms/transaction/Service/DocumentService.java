package com.sms.transaction.Service;

import com.sms.transaction.DTO.DocumentDTO;
import com.sms.transaction.Entities.Document;
import com.sms.transaction.Entities.Flat;
import com.sms.transaction.Entities.Society;
import com.sms.transaction.Entities.User;
import com.sms.transaction.Repository.DocumentRepository;
import com.sms.transaction.Repository.FlatRepository;
import com.sms.transaction.Repository.SocietyRepository;
import com.sms.transaction.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private FlatRepository flatRepository;

    private static final String UPLOAD_DIR = "uploads" + File.separator + "documents";

    public DocumentDTO.Response uploadDocument(MultipartFile file, Long societyId, Long flatId,
                                                Long uploadedById, String documentName,
                                                String documentType, String accessScope,
                                                String description) throws Exception {

        if (file == null || file.isEmpty()) {
            throw new Exception("File cannot be empty");
        }

        if (uploadedById == null) {
            throw new Exception("UploadedBy user ID is required");
        }

        // 1. Fetch User
        User uploader = userRepository.findById(uploadedById)
                .orElseThrow(() -> new Exception("User not found with ID: " + uploadedById));

        // 2. Determine Society
        Society society = null;
        if (societyId != null) {
            society = societyRepository.findById(societyId).orElse(null);
        }
        if (society == null) {
            society = uploader.getSociety();
        }
        if (society == null) {
            throw new Exception("Society could not be determined for this document");
        }

        // 3. Determine Flat
        Flat flat = null;
        if (flatId != null) {
            flat = flatRepository.findById(flatId).orElse(null);
        }

        // 4. Save file to disk
        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String savedFileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetPath = Paths.get(UPLOAD_DIR).resolve(savedFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // 5. Create and persist Document Entity
        Document document = new Document();
        document.setSociety(society);
        document.setFlat(flat);
        document.setUploadedBy(uploader);
        document.setDocumentName(documentName != null && !documentName.trim().isEmpty() ? documentName.trim() : (originalFilename != null ? originalFilename : "Document"));
        document.setDocumentType(documentType != null && !documentType.trim().isEmpty() ? documentType.trim() : "General");
        document.setAccessScope(accessScope != null && !accessScope.trim().isEmpty() ? accessScope.toUpperCase().trim() : "SOCIETY");
        document.setDocumentPath(savedFileName);
        document.setFileSize(file.getSize());
        document.setFileType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        document.setDescription(description);
        document.setUploadedAt(new Timestamp(System.currentTimeMillis()));

        Document saved = documentRepository.save(document);
        return mapToResponseDTO(saved);
    }

    public List<DocumentDTO.Response> getDocumentsBySociety(Long societyId, String accessScope) {
        List<Document> list;
        if (accessScope != null && !accessScope.trim().isEmpty()) {
            list = documentRepository.findBySocietyIdAndAccessScopeOrderByUploadedAtDesc(societyId, accessScope.toUpperCase().trim());
        } else {
            list = documentRepository.findBySocietyIdOrderByUploadedAtDesc(societyId);
        }
        return list.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    public List<DocumentDTO.Response> getDocumentsByFlat(Long flatId) {
        return documentRepository.findByFlatIdOrderByUploadedAtDesc(flatId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO.Response> getDocumentsByUser(Long userId) {
        return documentRepository.findByUploadedByIdOrderByUploadedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DocumentDTO.Response> getAllDocuments() {
        return documentRepository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public DocumentDTO.Response getDocumentById(Long id) throws Exception {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new Exception("Document not found with ID: " + id));
        return mapToResponseDTO(document);
    }

    public void deleteDocument(Long id, Long requesterId) throws Exception {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new Exception("Document not found with ID: " + id));

        // Delete physical file if exists
        try {
            Path path = Paths.get(UPLOAD_DIR).resolve(document.getDocumentPath());
            Files.deleteIfExists(path);
        } catch (Exception ignored) {
        }

        documentRepository.delete(document);
    }

    public byte[] getDocumentFileBytes(String fileName) throws IOException {
        Path path = Paths.get(UPLOAD_DIR).resolve(fileName);
        if (!Files.exists(path)) {
            // Also check relative to root uploads if stored under another subfolder
            Path rootPath = Paths.get("uploads").resolve(fileName);
            if (Files.exists(rootPath)) {
                return Files.readAllBytes(rootPath);
            }
            throw new IOException("Document file not found: " + fileName);
        }
        return Files.readAllBytes(path);
    }

    public MediaType getMediaTypeForFileName(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (lower.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        } else if (lower.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        } else if (lower.endsWith(".txt")) {
            return MediaType.TEXT_PLAIN;
        } else if (lower.endsWith(".html")) {
            return MediaType.TEXT_HTML;
        } else if (lower.endsWith(".json")) {
            return MediaType.APPLICATION_JSON;
        }
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    private DocumentDTO.Response mapToResponseDTO(Document document) {
        DocumentDTO.Response dto = new DocumentDTO.Response();
        dto.setId(document.getId());
        dto.setDocumentName(document.getDocumentName());
        dto.setDocumentType(document.getDocumentType());
        dto.setAccessScope(document.getAccessScope());
        dto.setDocumentPath(document.getDocumentPath());
        dto.setFileSize(document.getFileSize());
        dto.setFormattedFileSize(formatFileSize(document.getFileSize()));
        dto.setFileType(document.getFileType());
        dto.setDescription(document.getDescription());
        dto.setUploadedAt(document.getUploadedAt());

        if (document.getSociety() != null) {
            dto.setSocietyId(document.getSociety().getId());
            dto.setSocietyName(document.getSociety().getSocietyName());
        }

        if (document.getFlat() != null) {
            dto.setFlatId(document.getFlat().getId());
            dto.setFlatNumber(document.getFlat().getFlatNumber());
        }

        if (document.getUploadedBy() != null) {
            dto.setUploadedById(document.getUploadedBy().getId());
            String name = (document.getUploadedBy().getFirstName() != null ? document.getUploadedBy().getFirstName() : "")
                    + " " + (document.getUploadedBy().getLastName() != null ? document.getUploadedBy().getLastName() : "");
            dto.setUploadedByName(name.trim());
            dto.setUploadedByEmail(document.getUploadedBy().getEmail());
            if (document.getUploadedBy().getRole() != null) {
                dto.setUploadedByRole(document.getUploadedBy().getRole().getRoleName());
            }
        }

        return dto;
    }

    private String formatFileSize(Long size) {
        if (size == null || size <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        if (digitGroups >= units.length) digitGroups = units.length - 1;
        return String.format("%.1f %s", size / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
