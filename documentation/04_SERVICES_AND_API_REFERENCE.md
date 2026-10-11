# 📡 04. Microservices & REST API Reference

Comprehensive reference for all REST API endpoints across the Society Management System. All requests can be routed through the **API Gateway** on port `8080`.

---

## 1. 🔐 Auth Service (`auth-service` / Port `8081`)

### 1.1 User Login
- **Endpoint:** `POST /api/auth/login` or `POST /login`
- **Description:** Authenticates user credentials with BCrypt, verifies society status, and returns an auth token.
- **Request Body:**
```json
{
  "email": "owner@gmail.com",
  "password": "Password@123"
}
```
- **Response (200 OK):**
```json
{
  "id": 5,
  "firstName": "John",
  "lastName": "Doe",
  "email": "owner@gmail.com",
  "role": 3,
  "roleName": "Owner",
  "societyName": "Green Valley",
  "token": "jwt-token-5-1770198000"
}
```

### 1.2 User Registration
- **Endpoint:** `POST /api/auth/users/registerUser` or `POST /users/registerUser`
- **Description:** Registers new user. Role is dynamically determined by creator (`Owner` creates `Tenant`; `Secretary/Admin` creates `Owner`). Passwords are automatically hashed with BCrypt.
- **Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "tenant@gmail.com",
  "phoneNumber": "9876543210",
  "password": "Password@123",
  "createdByAdminId": 5
}
```
- **Response (201 Created):**
```json
{
  "message": "User registered successfully."
}
```

---

## 2. 🏢 Society Core Service (`society` / Port `8082`)

### 2.1 Society Registration
- **Endpoint:** `POST /api/society/societies/register` or `POST /societies/register`
- **Description:** Registers a new society in `PENDING` status and auto-provisions an Admin user. Passwords are encrypted with BCrypt.
- **Request Body:**
```json
{
  "societyName": "Royal Palms Residency",
  "address": "45 Park Street",
  "city": "Pune",
  "state": "Maharashtra",
  "pincode": "411001",
  "contactEmail": "admin@royalpalms.com",
  "contactPhone": "9812345678",
  "password": "AdminPassword@123"
}
```

### 2.2 Get All Societies (SuperAdmin)
- **Endpoint:** `GET /api/society/societies`
- **Response (200 OK):** List of all registered societies with their status (`PENDING`, `APPROVED`, `REJECTED`).

### 2.3 Approve / Reject Society (SuperAdmin)
- **Endpoint:** `PUT /api/society/societies/{id}/status`
- **Request Body:**
```json
{
  "status": "APPROVED"
}
```

### 2.4 Flat Management
- **Add Flat:** `POST /api/society/flats`
- **Get Flats by Society:** `GET /api/society/flats/society/{societyId}`
- **Update Flat Ownership:** `PUT /api/society/flats/{flatId}/owner/{userId}`

### 2.5 Complaints Service
- **Raise Complaint:** `POST /api/society/complaints`
- **Get Complaints by Society:** `GET /api/society/complaints/society/{societyId}`
- **Update Complaint Status:** `PUT /api/society/complaints/{id}/status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`)

### 2.6 Publish Notices Service
- **Publish Notice:** `POST /api/society/notices`
- **Get Notices by Society:** `GET /api/society/notices/society/{societyId}`

---

## 3. 💳 Transaction Service (`transaction-service` / Port `8083`)

### 3.1 Process Maintenance Payment
- **Endpoint:** `POST /api/payment/process`
- **Request Body:**
```json
{
  "flatId": 102,
  "userId": 5,
  "amount": 2500.00,
  "month": "August 2026",
  "paymentMethod": "UPI"
}
```

### 3.2 Fetch Payment History
- **Endpoint:** `GET /api/payment/history/user/{userId}`
- **Endpoint:** `GET /api/payment/history/society/{societyId}`

### 3.3 Document Management Endpoints

#### 3.3.1 Upload Document
- **Endpoint:** `POST /documents/upload` or `POST /api/document/upload`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `file` (MultipartFile, Required): Binary file to upload (PDF, Images, DOCX, TXT - Max 25MB).
  - `uploadedById` (Long, Required): ID of the user uploading the document.
  - `societyId` (Long, Optional): ID of the society (defaults to user's society).
  - `flatId` (Long, Optional): ID of the associated flat (for flat-specific documents).
  - `documentName` (String, Optional): Custom title for the document.
  - `documentType` (String, Optional): Category e.g., `"Society Rules"`, `"Agreement"`, `"Financial Report"`, `"Meeting Minutes"`, `"Identity Proof"`, `"Maintenance Receipt"`, `"General"`.
  - `accessScope` (String, Optional): `"SOCIETY"` (All residents), `"FLAT"` (Flat owner/tenant), or `"PRIVATE"` (Uploader & Admin only).
  - `description` (String, Optional): Notes or description.
- **Success Response (201 Created):**
```json
{
  "id": 11,
  "societyId": 1,
  "societyName": "Green Acres Residency",
  "flatId": 101,
  "flatNumber": "A-101",
  "documentName": "Society Bye Laws 2026",
  "documentType": "Society Rules",
  "accessScope": "SOCIETY",
  "documentPath": "1722915000000_a1b2c3d4.pdf",
  "fileSize": 1048576,
  "formattedFileSize": "1.0 MB",
  "fileType": "application/pdf",
  "description": "Official updated Bye Laws and Code of Conduct",
  "uploadedById": 1,
  "uploadedByName": "John Doe",
  "uploadedByEmail": "john.secretary@society.com",
  "uploadedByRole": "SECRETARY",
  "uploadedAt": "2026-08-06T03:45:00.000+00:00"
}
```

#### 3.3.2 Fetch Documents by Society
- **Endpoint:** `GET /documents/society/{societyId}?scope={SOCIETY|FLAT|PRIVATE}`
- **Response (200 OK):**
```json
[
  {
    "id": 1,
    "societyId": 1,
    "societyName": "Green Acres Residency",
    "flatId": null,
    "flatNumber": null,
    "documentName": "Society Bye Laws",
    "documentType": "Society Rules",
    "accessScope": "SOCIETY",
    "documentPath": "byelaws_1.pdf",
    "fileSize": 1048576,
    "formattedFileSize": "1.0 MB",
    "fileType": "application/pdf",
    "description": "Official Society Bye Laws & Guidelines",
    "uploadedById": 1,
    "uploadedByName": "Super Admin",
    "uploadedByEmail": "admin@sms.com",
    "uploadedByRole": "SUPER_ADMIN",
    "uploadedAt": "2026-07-07T04:20:42.000+00:00"
  }
]
```

#### 3.3.3 Fetch Documents by Flat
- **Endpoint:** `GET /documents/flat/{flatId}`
- **Response (200 OK):** Array of document response objects linked to the flat.

#### 3.3.4 Fetch Documents Uploaded by User
- **Endpoint:** `GET /documents/user/{userId}`
- **Response (200 OK):** Array of document response objects uploaded by the user.

#### 3.3.5 Fetch All Documents (SuperAdmin)
- **Endpoint:** `GET /documents/all`
- **Response (200 OK):** Array of all document records across all societies.

#### 3.3.6 Stream / Preview Document File
- **Endpoint:** `GET /documents/file/{fileName}`
- **Header:** `Content-Disposition: inline; filename="{fileName}"`
- **Response (200 OK):** Raw binary stream with inferred `Content-Type` (`application/pdf`, `image/png`, `image/jpeg`, etc.).

#### 3.3.7 Download Document File
- **Endpoint:** `GET /documents/download/{fileName}`
- **Header:** `Content-Disposition: attachment; filename="{fileName}"`
- **Response (200 OK):** Direct file download attachment.

#### 3.3.8 Delete Document
- **Endpoint:** `DELETE /documents/{id}?userId={userId}`
- **Response (200 OK):**
```json
{
  "message": "Document deleted successfully",
  "id": 11
}
```
