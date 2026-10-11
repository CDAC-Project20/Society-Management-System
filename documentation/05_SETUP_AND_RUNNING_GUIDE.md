# 🚀 05. Setup & Running Guide

This guide walks you through setting up the environment, initializing the MySQL database, running the microservices, and launching the React frontend.

---

## 📋 Prerequisites

1. **Java JDK 21+** (e.g. `D:\SOFTWARES\JAVA`)
2. **Node.js (v18+) & npm**
3. **MySQL Server 8.0+** running on `localhost:3306`

---

## 🗄️ 1. Database Initialization

Execute the SQL schema located at:
`DataBase/P20_CreateDB.sql`

```bash
mysql -u root -p < "d:\CDAC\CDAC Project\React\Society-Management-System\DataBase\P20_CreateDB.sql"
```

Verify that default roles are present in the `roles` table:
- `1` : `SuperAdmin`
- `2` : `Admin` / `Secretary`
- `3` : `Owner`
- `4` : `Tenant`

---

## ⚡ 2. Automated One-Click Startup (Recommended)

All startup scripts are located in the **`scripts/`** directory.

### Option A: Start Everything (Backend + Frontend)
Double-click or run from PowerShell:
```powershell
.\scripts\start-all.ps1
# or
.\scripts\start-all.bat
```
This automatically launches all 5 backend microservices in their correct startup order, followed by the React UI.

### Option B: Start Backend Services Only
```powershell
.\scripts\start-backend.ps1
# or
.\scripts\start-backend.bat
```

### Option C: Stop All Running Services
```cmd
.\scripts\stop-all.bat
```

---

## 🚦 3. Manual Startup Sequence (Step-by-Step)

If running manually or debugging in an IDE (e.g. VS Code, Eclipse, IntelliJ), start in this strict order:

| Step | Service | Directory | Port | Command / Main Class |
|---|---|---|---|---|
| **1** | **Discovery Server** | `Backend/Java/discovery-server` | `8761` | `.\mvnw.cmd spring-boot:run` / `DiscoveryServerApplication` |
| **2** | **API Gateway** | `Backend/Java/api-gateway` | `8080` | `.\mvnw.cmd spring-boot:run` / `ApiGatewayApplication` |
| **3** | **Auth Service** | `Backend/Java/auth-service` | `8081` | `.\mvnw.cmd spring-boot:run` / `AuthServiceApplication` |
| **4** | **Society Service** | `Backend/Java/society` | `8082` | `.\mvnw.cmd spring-boot:run` / `SocietyApplication` |
| **5** | **Transaction Service**| `Backend/Java/transaction-service`| `8083` | `.\mvnw.cmd spring-boot:run` / `TransactionServiceApplication`|
| **6** | **React Frontend** | `my-app` | `3000` | `npm start` |

---

## 🔍 4. Verification & Dashboards

1. **Eureka Dashboard:** Open `http://localhost:8761`
   - Confirm instances for `API-GATEWAY`, `AUTH-SERVICE`, `SOCIETY-SERVICE`, and `TRANSACTION-SERVICE` show as **UP**.
2. **React Web App:** Open `http://localhost:3000`
3. **Gateway Health:** Check `http://localhost:8080/actuator/health`

---

## 🛠️ 5. Troubleshooting Common Issues

- **Port 8080 Already in Use:** Kill the occupying process using `stop-all.bat` or run:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force
  ```
- **Eureka Registration Lag:** Services take 5–10 seconds to register with Eureka upon startup. The startup scripts include built-in wait timers to ensure smooth registration.
