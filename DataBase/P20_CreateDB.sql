-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: society_management_system
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `FlatId` bigint NOT NULL,
  `RaisedBy` bigint NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `Category` varchar(100) DEFAULT NULL,
  `Priority` enum('Low','Medium','High') DEFAULT 'Medium',
  `Status` enum('Open','In Progress','Resolved','Closed') DEFAULT 'Open',
  `AssignedTo` bigint DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ResolvedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Complaint_Society` (`SocietyId`),
  KEY `FK_Complaint_Flat` (`FlatId`),
  KEY `FK_Complaint_RaisedBy` (`RaisedBy`),
  KEY `FK_Complaint_AssignedTo` (`AssignedTo`),
  CONSTRAINT `FK_Complaint_AssignedTo` FOREIGN KEY (`AssignedTo`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_Complaint_Flat` FOREIGN KEY (`FlatId`) REFERENCES `flats` (`Id`),
  CONSTRAINT `FK_Complaint_RaisedBy` FOREIGN KEY (`RaisedBy`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_Complaint_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `FlatId` bigint DEFAULT NULL,
  `DocumentName` varchar(255) NOT NULL,
  `DocumentType` varchar(100) DEFAULT NULL,
  `DocumentPath` varchar(500) NOT NULL,
  `UploadedBy` bigint NOT NULL,
  `UploadedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `FK_Document_Society` (`SocietyId`),
  KEY `FK_Document_Flat` (`FlatId`),
  KEY `FK_Document_User` (`UploadedBy`),
  CONSTRAINT `FK_Document_Flat` FOREIGN KEY (`FlatId`) REFERENCES `flats` (`Id`),
  CONSTRAINT `FK_Document_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`),
  CONSTRAINT `FK_Document_User` FOREIGN KEY (`UploadedBy`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `flats`
--

DROP TABLE IF EXISTS `flats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flats` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `FlatNumber` varchar(20) NOT NULL,
  `FloorNumber` int DEFAULT NULL,
  `FlatType` varchar(50) DEFAULT NULL,
  `Status` enum('Occupied','Vacant') DEFAULT 'Vacant',
  `OwnerId` bigint NOT NULL,
  `TenantId` bigint DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Flat_Society` (`SocietyId`),
  KEY `FK_Flat_Owner` (`OwnerId`),
  KEY `FK_Flat_Tenant` (`TenantId`),
  CONSTRAINT `FK_Flat_Owner` FOREIGN KEY (`OwnerId`) REFERENCES `users` (`Id`),
  CONSTRAINT `FK_Flat_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`),
  CONSTRAINT `FK_Flat_Tenant` FOREIGN KEY (`TenantId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `FlatId` bigint NOT NULL,
  `Month` int NOT NULL,
  `Year` int NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `DueDate` date DEFAULT NULL,
  `Status` enum('Pending','Paid','Overdue') DEFAULT 'Pending',
  `GeneratedBy` bigint NOT NULL,
  `GeneratedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `FK_Maintenance_Society` (`SocietyId`),
  KEY `FK_Maintenance_Flat` (`FlatId`),
  KEY `FK_Maintenance_User` (`GeneratedBy`),
  CONSTRAINT `FK_Maintenance_Flat` FOREIGN KEY (`FlatId`) REFERENCES `flats` (`Id`),
  CONSTRAINT `FK_Maintenance_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`),
  CONSTRAINT `FK_Maintenance_User` FOREIGN KEY (`GeneratedBy`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meetings` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Agenda` text,
  `MeetingDate` datetime DEFAULT NULL,
  `Venue` varchar(255) DEFAULT NULL,
  `CreatedBy` bigint NOT NULL,
  `Status` enum('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
  PRIMARY KEY (`Id`),
  KEY `FK_Meeting_Society` (`SocietyId`),
  KEY `FK_Meeting_User` (`CreatedBy`),
  CONSTRAINT `FK_Meeting_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`),
  CONSTRAINT `FK_Meeting_User` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `PublishedBy` bigint NOT NULL,
  `PublishDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ExpiryDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Notice_Society` (`SocietyId`),
  KEY `FK_Notice_User` (`PublishedBy`),
  CONSTRAINT `FK_Notice_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`),
  CONSTRAINT `FK_Notice_User` FOREIGN KEY (`PublishedBy`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `MaintenanceId` bigint NOT NULL,
  `PaidBy` bigint NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentMode` enum('Cash','UPI','Card','Net Banking') DEFAULT NULL,
  `TransactionId` varchar(100) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Status` enum('Success','Failed','Pending') DEFAULT 'Success',
  PRIMARY KEY (`Id`),
  KEY `FK_Payment_Maintenance` (`MaintenanceId`),
  KEY `FK_Payment_User` (`PaidBy`),
  CONSTRAINT `FK_Payment_Maintenance` FOREIGN KEY (`MaintenanceId`) REFERENCES `maintenance` (`Id`),
  CONSTRAINT `FK_Payment_User` FOREIGN KEY (`PaidBy`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `polls`
--

DROP TABLE IF EXISTS `polls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polls` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `Option1` varchar(255) DEFAULT NULL,
  `Option2` varchar(255) DEFAULT NULL,
  `Option3` varchar(255) DEFAULT NULL,
  `Option4` varchar(255) DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `CreatedBy` bigint NOT NULL,
  `Status` enum('Open','Closed') DEFAULT 'Open',
  PRIMARY KEY (`Id`),
  KEY `FK_Poll_Society` (`SocietyId`),
  KEY `FK_Poll_User` (`CreatedBy`),
  CONSTRAINT `FK_Poll_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`),
  CONSTRAINT `FK_Poll_User` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleName` (`RoleName`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `societies`
--

DROP TABLE IF EXISTS `societies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `societies` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyName` varchar(200) NOT NULL,
  
  `Address` varchar(500) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Pincode` varchar(20) DEFAULT NULL,
  `ContactEmail` varchar(255) DEFAULT NULL,
  `ContactPhone` varchar(20) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`Id`),
  
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `SocietyId` bigint DEFAULT NULL,
  `RoleId` bigint NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`),
  KEY `FK_User_Society` (`SocietyId`),
  KEY `FK_User_Role` (`RoleId`),
  CONSTRAINT `FK_User_Role` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`Id`),
  CONSTRAINT `FK_User_Society` FOREIGN KEY (`SocietyId`) REFERENCES `societies` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `Id` bigint NOT NULL AUTO_INCREMENT,
  `PollId` bigint NOT NULL,
  `UserId` bigint NOT NULL,
  `SelectedOption` varchar(255) DEFAULT NULL,
  `VotedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_Poll_User` (`PollId`,`UserId`),
  KEY `FK_Vote_User` (`UserId`),
  CONSTRAINT `FK_Vote_Poll` FOREIGN KEY (`PollId`) REFERENCES `polls` (`Id`),
  CONSTRAINT `FK_Vote_User` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 21:55:27
