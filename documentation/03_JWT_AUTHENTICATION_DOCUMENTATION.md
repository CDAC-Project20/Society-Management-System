# 🔑 03. JWT (JSON Web Token) & Authentication Documentation

This document describes the **stateless authentication architecture**, token structure, and role authorization mechanisms in the **Society Management System**.

---

## 📌 1. Authentication Concept

The system uses **stateless token-based authentication** (JWT). When a user logs in successfully, the backend creates and returns a signed authentication token. The client stores this token and sends it in the `Authorization: Bearer <token>` header for subsequent requests.

### Advantages:
- **Statelessness:** No session storage needed on servers, enabling effortless horizontal scaling across microservices.
- **Cross-Service Verification:** Any microservice or gateway can decode and verify the token signature.
- **Decentralized RBAC:** User ID, Role, and Society ID are encapsulated directly in the token payload.

---

## 🧩 2. JWT Structure

A JSON Web Token consists of three parts separated by dots (`.`):
`header.payload.signature`

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInJvbGUiOiJPd25lciIsInNvY2lldHlJZCI6MSwiaWF0IjoxNzAwMDAwMDAwfQ.abcdef1234567890
```

### 1. Header (Algorithm & Token Type)
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload (Claims & User Context)
```json
{
  "sub": "user@example.com",
  "userId": 14,
  "role": "Owner",
  "roleId": 3,
  "societyId": 2,
  "societyName": "Royal Garden Apartments",
  "iat": 1770198000,
  "exp": 1770284400
}
```

### 3. Signature
Generated using HMAC-SHA256 with the server's private secret key:
$$\text{Signature} = \text{HMACSHA256}(\text{base64UrlEncode}(\text{Header}) + "." + \text{base64UrlEncode}(\text{Payload}),\ \text{SecretKey})$$

---

## 🔄 3. Complete Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor React as React App (Client)
    participant GW as API Gateway (8080)
    participant Auth as Auth Service (8081)
    participant DB as MySQL DB
    participant Society as Society Service (8082)

    React->>GW: POST /api/auth/login {email, password}
    GW->>Auth: Forward Login Request
    Auth->>DB: Validate credentials & society status
    DB-->>Auth: Validated User Data
    Auth->>Auth: Generate Auth Token
    Auth-->>GW: Response with Token + UserDTO
    GW-->>React: Store in localStorage / session
    
    Note over React: Future Authenticated Requests
    React->>GW: GET /api/society/complaints (with Auth Token)
    GW->>Society: Route to Society Service
    Society-->>GW: Return Authorized Data
    GW-->>React: Render UI
```

---

## 🛡️ 4. Role-Based Access Control (RBAC)

The frontend routes and backend services enforce privileges based on the user's role:

| Role | Allowed Dashboards & Features |
|---|---|
| **SuperAdmin** | `/superadmin` — View all societies, approve/reject society applications, view all users across societies. |
| **Admin / Secretary** | `/admin`, `/secretary` — Society dashboard, add flats, register owners, publish notices, manage complaints. |
| **Owner** | `/owner` — Register tenants, view flats, pay maintenance, raise complaints, view notices. |
| **Tenant** | `/tenant` — View flat details, pay rent/bills, raise complaints, view notices. |
