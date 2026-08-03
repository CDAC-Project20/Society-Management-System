# 🏢 Society Management System - Project Running & Architecture Guide

A complete guide for running, configuring, and understanding the **Society Management System** microservices architecture and multi-role frontend.

---

## 📌 1. System Architecture & Ports

The project is structured into **5 Spring Boot microservices** and **4 Vite React frontend roles**:

### ⚙️ Backend Microservices

| Service Name | Directory Path | Port | Responsibility |
| :--- | :--- | :--- | :--- |
| **Discovery Server** | `Backend/Java/discovery-server` | **`8761`** | Eureka Service Registry & Heartbeat monitoring |
| **API Gateway** | `Backend/Java/api-gateway` | **`8080`** | Central Gateway, Global CORS, Dynamic Routing via `lb://` |
| **Auth Service** | `Backend/Java/auth-service` | **`8081`** | User Registration, Authentication (Email + Password), Role Management |
| **Society Service** | `Backend/Java/society` | **`8082`** | Societies, Flats, Notices, Complaints (Role-based permissions) |
| **Transaction Service**| `Backend/Java/transaction-service`| **`8083`** | Documents, Invoices & Payment Transactions |

### 🖥️ Frontend (React / Vite)

| Role | Port | Command | URL |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | **`5173`** | `npm run dev:superadmin` | [http://localhost:5173](http://localhost:5173) |
| **Secretary**  | **`5174`** | `npm run dev:secretary`  | [http://localhost:5174](http://localhost:5174) |
| **Owner**      | **`5175`** | `npm run dev:owner`      | [http://localhost:5175](http://localhost:5175) |
| **Tenant**     | **`5176`** | `npm run dev:tenant`     | [http://localhost:5176](http://localhost:5176) |

---

## 📋 2. Prerequisites

Before starting the project, ensure you have:
1. **Java JDK 21+** installed (Configured at `D:\SOFTWARES\JAVA` or in your system `JAVA_HOME`).
2. **Node.js (v18+) & npm** installed.
3. **MySQL Server** running on `localhost:3306`:
   - Database name: `society_db`
   - Username: `root`
   - Password: `root`

---

## 🚀 3. Quick Start (Single Terminal - Silent Background Mode)

When you run the start script, **all 5 backend microservices launch silently in the background** (no extra terminal windows), and the **React frontend starts right in your current terminal**.

### Method A: Using Command Prompt or Double-Click
Run the script from the project root:
```cmd
.\scripts\start-all.bat
```
*(Or double-click `start-all.bat` inside the `scripts` folder)*

### Method B: Using PowerShell
```powershell
.\scripts\start-all.ps1
```

> 📁 **Backend Logs**: All microservice logs are automatically written to `logs/` (e.g. `logs/discovery.log`, `logs/auth.log`, `logs/society.log`, `logs/transaction.log`, `logs/gateway.log`).

### 🛑 To Stop All Services in One Click:
```cmd
.\scripts\stop-all.bat
```
*(This automatically terminates all background microservices and frontend ports)*

---

## 🛠️ 4. Manual Startup (Step-by-Step)

If you prefer to run services individually in separate terminals:

### Step 1: Start Discovery Server (Eureka)
```powershell
cd "Backend/Java/discovery-server"
$env:JAVA_HOME = "D:\SOFTWARES\JAVA"
.\mvnw.cmd spring-boot:run
```
> ⏳ *Wait ~10 seconds until Eureka dashboard is reachable at [http://localhost:8761](http://localhost:8761).*

### Step 2: Start Microservices
Open separate terminal tabs for each:

- **Auth Service (Port 8081):**
  ```powershell
  cd "Backend/Java/auth-service"
  $env:JAVA_HOME = "D:\SOFTWARES\JAVA"
  .\mvnw.cmd spring-boot:run
  ```

- **Society Service (Port 8082):**
  ```powershell
  cd "Backend/Java/society"
  $env:JAVA_HOME = "D:\SOFTWARES\JAVA"
  .\mvnw.cmd spring-boot:run
  ```

- **Transaction Service (Port 8083):**
  ```powershell
  cd "Backend/Java/transaction-service"
  $env:JAVA_HOME = "D:\SOFTWARES\JAVA"
  .\mvnw.cmd spring-boot:run
  ```

### Step 3: Start API Gateway (Port 8080)
```powershell
cd "Backend/Java/api-gateway"
$env:JAVA_HOME = "D:\SOFTWARES\JAVA"
.\mvnw.cmd spring-boot:run
```

### Step 4: Start Frontend Ports
```powershell
cd "my-app"
# To start all roles or individual roles:
npm run dev:superadmin   # Port 5173
npm run dev:secretary    # Port 5174
npm run dev:owner        # Port 5175
npm run dev:tenant       # Port 5176
```

---

## 🔑 5. Authentication & Login Details

- **Login Credentials**: Login uses **Email** and **Password** (not username).
- **Endpoint**: `POST http://localhost:8080/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Role Routing**:
  | Role ID | Role Name | Redirect Route | Default Port |
  | :--- | :--- | :--- | :--- |
  | `1` | SuperAdmin | `/superadmin` | `5173` |
  | `2` | Secretary | `/secretary` | `5174` |
  | `3` | Owner | `/owner` | `5175` |
  | `4` | Tenant | `/tenant` | `5176` |

---

## 🌐 6. API Gateway Routing Reference

All frontend API calls should be targeted at **`http://localhost:8080`**:

| Prefix Path | Target Microservice | Internal Port | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/**` | `AUTH-SERVICE` | `8081` | Login, Register, User profile |
| `/api/society/**` | `SOCIETY-SERVICE` | `8082` | Societies, Flats, Notices, Complaints |
| `/api/document/**` | `TRANSACTION-SERVICE` | `8083` | Document uploads and management |
| `/api/payment/**` | `TRANSACTION-SERVICE` | `8083` | Maintenance & fee payments |

---

## ❓ 7. Troubleshooting & FAQs

### Q: Port is already in use error (`BindException` / `EADDRINUSE`)
Run `.\stop-all.bat` from the root folder to clear all background processes on ports 8080-8083, 8761, and 5173-5176.

### Q: Login fails with "Server error"
1. Verify MySQL service is running (`localhost:3306`).
2. Verify Discovery Server is running on `http://localhost:8761`.
3. Check `auth-service` logs to ensure database connection is established.

### Q: Complaints submission error "Only Owners and Tenants are allowed"
The complaint endpoint enforces role verification. Ensure you are logged in as an Owner (`role = 3`) or Tenant (`role = 4`).
