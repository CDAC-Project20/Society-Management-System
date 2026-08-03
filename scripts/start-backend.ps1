$root = Split-Path -Parent $PSScriptRoot
$logsDir = "$root\logs"
if (!(Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting All 5 Backend Microservices (Background Mode)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "1. Starting Discovery Server (Port 8761)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\discovery-server`" && set JAVA_HOME=D:\SOFTWARES\JAVA&& mvnw.cmd spring-boot:run > `"$logsDir\discovery.log`" 2>&1" -WindowStyle Hidden

Write-Host "Waiting 8 seconds for Eureka Discovery Server..." -ForegroundColor DarkGray
Start-Sleep -Seconds 8

Write-Host "2. Starting Auth Service (Port 8081)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\auth-service`" && set JAVA_HOME=D:\SOFTWARES\JAVA&& mvnw.cmd spring-boot:run > `"$logsDir\auth.log`" 2>&1" -WindowStyle Hidden

Write-Host "3. Starting Society Service (Port 8082)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\society`" && set JAVA_HOME=D:\SOFTWARES\JAVA&& mvnw.cmd spring-boot:run > `"$logsDir\society.log`" 2>&1" -WindowStyle Hidden

Write-Host "4. Starting Transaction Service (Port 8083)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\transaction-service`" && set JAVA_HOME=D:\SOFTWARES\JAVA&& mvnw.cmd spring-boot:run > `"$logsDir\transaction.log`" 2>&1" -WindowStyle Hidden

Write-Host "Waiting 5 seconds before starting API Gateway..." -ForegroundColor DarkGray
Start-Sleep -Seconds 5

Write-Host "5. Starting API Gateway (Port 8080)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\api-gateway`" && set JAVA_HOME=D:\SOFTWARES\JAVA&& mvnw.cmd spring-boot:run > `"$logsDir\gateway.log`" 2>&1" -WindowStyle Hidden

Write-Host "`nAll 5 backend microservices started successfully!" -ForegroundColor Green
Write-Host "Logs are saved in: $logsDir\" -ForegroundColor DarkGray
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  * Discovery Server:    http://localhost:8761"
Write-Host "  * API Gateway:         http://localhost:8080"
Write-Host "  * Auth Service:        http://localhost:8081"
Write-Host "  * Society Service:     http://localhost:8082"
Write-Host "  * Transaction Service: http://localhost:8083"
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
