# Microservices Architecture Documentation

This document outlines the microservices architecture setup implemented for the **Society Management System**. The backend has been transitioned from a standalone monolith into a microservices pattern using Spring Cloud.

## Architecture Components

The backend now consists of three main components:

1. **Discovery Server** (`discovery-server`)
2. **API Gateway** (`api-gateway`)
3. **Core Service** (`society`)

---

### 1. Discovery Server (Service Registry)
- **Directory**: `Backend/Java/discovery-server`
- **Port**: `8761`
- **Purpose**: Acts as the central registry where all microservices register themselves so they can be discovered by the API Gateway and by each other.
- **Key Dependencies**: `spring-cloud-starter-netflix-eureka-server`
- **Usage**: You can view all active and registered microservices by visiting `http://localhost:8761` in your browser when this server is running.

### 2. API Gateway
- **Directory**: `Backend/Java/api-gateway`
- **Port**: `8080`
- **Purpose**: Serves as the single entry point for the React frontend. It receives incoming requests and routes them to the appropriate backend microservice based on the URL path.
- **Key Dependencies**: `spring-cloud-starter-gateway`, `spring-cloud-starter-netflix-eureka-client`
- **Routing Configuration**: It is currently configured to take any request matching the path `/api/**` and route it to the `society` service using a load balancer (`lb://society`).

### 3. Core Service (`society`)
- **Directory**: `Backend/Java/society`
- **Port**: `8081` (Changed from 8080 to prevent conflict with the API Gateway)
- **Purpose**: Contains the core business logic, database connections, and REST endpoints for the Society Management System.
- **Key Dependencies Added**: `spring-cloud-starter-netflix-eureka-client`
- **Configuration**: Includes `@EnableDiscoveryClient` in the main application class and is configured to register with the Eureka server running on `http://localhost:8761/eureka/`.

---

## How to Run the Application

Because microservices depend on each other, they should be started in a specific order:

1. **Start the Discovery Server**
   - Run `DiscoveryServerApplication.java` from your IDE.
   - Wait until it fully starts (verify via `http://localhost:8761`).

2. **Start the Core Service (`society`)**
   - Run `SocietyApplication.java` from your IDE.
   - Wait until you see it registered in the Eureka Dashboard.

3. **Start the API Gateway**
   - Run `ApiGatewayApplication.java` from your IDE.
   - Wait until you see it registered in the Eureka Dashboard alongside the `society` service.

## Connecting the React Frontend

Your React application does **not** need to change its API endpoints right now if it was already pointing to `http://localhost:8080`. 
The API Gateway is now running on `8080` and will intercept those requests and forward them internally to the `society` service running on `8081`.
