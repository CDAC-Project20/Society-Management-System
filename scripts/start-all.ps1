$root = Split-Path -Parent $PSScriptRoot
$logsDir = "$root\logs"
if (!(Test-Path $logsDir)) { New-Item -ItemType Directory -Path $logsDir | Out-Null }

# Load .env variables if present
if (Test-Path "$root\.env") {
    Get-Content "$root\.env" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and !$line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $name = $parts[0].Trim()
            $val = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $val, "Process")
        }
    }
}

$javaPath = if (Test-Path "C:\Program Files\Java\jdk-21.0.10") { "C:\Program Files\Java\jdk-21.0.10" } elseif (Test-Path "D:\SOFTWARES\JAVA") { "D:\SOFTWARES\JAVA" } else { $env:JAVA_HOME }

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Starting Society Management System (Silent Background Mode)" -ForegroundColor Cyan
Write-Host " Using Java: $javaPath" -ForegroundColor DarkCyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "1. Starting Discovery Server (Port 8761)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\discovery-server`" && set JAVA_HOME=$javaPath&& mvnw.cmd spring-boot:run > `"$logsDir\discovery.log`" 2>&1" -WindowStyle Hidden

Write-Host "Waiting 8 seconds for Eureka Discovery Server..." -ForegroundColor DarkGray
Start-Sleep -Seconds 8

Write-Host "2. Starting Auth Service (Port 8081)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\auth-service`" && set JAVA_HOME=$javaPath&& mvnw.cmd spring-boot:run > `"$logsDir\auth.log`" 2>&1" -WindowStyle Hidden

Write-Host "3. Starting Society Service (Port 8082)..." -ForegroundColor Yellow
$geminiEnvKey = $env:GEMINI_API_KEY
$geminiEnvModel = $env:GEMINI_MODEL
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\society`" && set JAVA_HOME=$javaPath&& set GEMINI_API_KEY=$geminiEnvKey&& set GEMINI_MODEL=$geminiEnvModel&& mvnw.cmd spring-boot:run > `"$logsDir\society.log`" 2>&1" -WindowStyle Hidden

Write-Host "4. Starting Transaction Service (Port 8083)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\transaction-service`" && set JAVA_HOME=$javaPath&& mvnw.cmd spring-boot:run > `"$logsDir\transaction.log`" 2>&1" -WindowStyle Hidden

Write-Host "Waiting 15 seconds for microservices to compile and register with Eureka..." -ForegroundColor DarkGray
Start-Sleep -Seconds 15

Write-Host "5. Starting API Gateway (Port 8080)..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList '/c', "cd /d `"$root\Backend\Java\api-gateway`" && set JAVA_HOME=$javaPath&& mvnw.cmd spring-boot:run > `"$logsDir\gateway.log`" 2>&1" -WindowStyle Hidden

Write-Host "`nAll 5 backend microservices running silently in background!" -ForegroundColor Green
Write-Host "Log files stored in: $logsDir\" -ForegroundColor DarkGray
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  * Discovery Server:    http://localhost:8761" -ForegroundColor Gray
Write-Host "  * API Gateway:         http://localhost:8080" -ForegroundColor Gray
Write-Host "  * Auth Service:        http://localhost:8081" -ForegroundColor Gray
Write-Host "  * Society Service:     http://localhost:8082" -ForegroundColor Gray
Write-Host "  * Transaction Service: http://localhost:8083" -ForegroundColor Gray
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray

Write-Host "`n6. Starting React Frontend..." -ForegroundColor Cyan
Set-Location "$root\my-app"
cmd.exe /c "npm run dev"

