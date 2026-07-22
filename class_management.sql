-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: class_management
-- ------------------------------------------------------
-- Server version	8.0.38

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
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `ClassId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `TeacherUserId` int NOT NULL,
  `AssistantUserId` int DEFAULT NULL,
  `Status` enum('Active','Finished') NOT NULL DEFAULT 'Active',
  `Base` varchar(100) DEFAULT NULL,
  `Tuition` decimal(15,0) NOT NULL,
  `TuitionType` enum('Monthly','Quarter','Course','Flexible') NOT NULL,
  `Subject` varchar(255) NOT NULL,
  `HubId` int NOT NULL,
  PRIMARY KEY (`ClassId`),
  KEY `fk_class_teacher_idx` (`TeacherUserId`),
  KEY `fk_class_assistant_idx` (`AssistantUserId`),
  KEY `fk_class_hub_idx` (`HubId`),
  CONSTRAINT `fk_class_assistant` FOREIGN KEY (`AssistantUserId`) REFERENCES `user` (`UserId`),
  CONSTRAINT `fk_class_hub` FOREIGN KEY (`HubId`) REFERENCES `hub` (`HubId`),
  CONSTRAINT `fk_class_teacher` FOREIGN KEY (`TeacherUserId`) REFERENCES `user` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class_grade_weight`
--

DROP TABLE IF EXISTS `class_grade_weight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_grade_weight` (
  `ClassId` int NOT NULL,
  `Category` varchar(50) NOT NULL,
  `Weight` decimal(5,2) NOT NULL,
  PRIMARY KEY (`ClassId`,`Category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class_homework`
--

DROP TABLE IF EXISTS `class_homework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_homework` (
  `ClassHomeworkId` int NOT NULL AUTO_INCREMENT,
  `ClassId` int NOT NULL,
  `HomeworkId` int NOT NULL,
  `DueDate` date NOT NULL,
  `AssignedDate` date NOT NULL,
  `PublicIdForm` varchar(5) NOT NULL,
  `IsFaceAuthEnabled` tinyint NOT NULL DEFAULT '0',
  `Type` varchar(45) DEFAULT 'Homework',
  PRIMARY KEY (`ClassHomeworkId`),
  UNIQUE KEY `PublicIdForm_UNIQUE` (`PublicIdForm`),
  KEY `fk_homeworkclass_homework_idx` (`HomeworkId`),
  KEY `fk_homeworkclass_class_idx` (`ClassId`),
  CONSTRAINT `fk_homeworkclass_class` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_homeworkclass_homework` FOREIGN KEY (`HomeworkId`) REFERENCES `homework` (`HomeworkId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `class_student`
--

DROP TABLE IF EXISTS `class_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_student` (
  `ClassStudentId` int NOT NULL AUTO_INCREMENT,
  `ClassId` int NOT NULL,
  `StudentId` int NOT NULL,
  `EnrollDate` date DEFAULT NULL,
  PRIMARY KEY (`ClassStudentId`),
  UNIQUE KEY `uniq_class_student` (`ClassId`,`StudentId`),
  KEY `fk_class_idx` (`ClassId`),
  KEY `fk_class_student_idx` (`StudentId`),
  CONSTRAINT `fk_class` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_class_student` FOREIGN KEY (`StudentId`) REFERENCES `student` (`StudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `homework`
--

DROP TABLE IF EXISTS `homework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homework` (
  `HomeworkId` int NOT NULL AUTO_INCREMENT,
  `HubId` int NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Content` text,
  `CreatedByUserId` int NOT NULL,
  `CreatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime DEFAULT NULL,
  `AnswerKey` text,
  PRIMARY KEY (`HomeworkId`),
  KEY `fk_homework_hub_idx` (`HubId`),
  KEY `fk_homework_createdbyuser_idx` (`CreatedByUserId`),
  CONSTRAINT `fk_homework_createdbyuser` FOREIGN KEY (`CreatedByUserId`) REFERENCES `user` (`UserId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_homework_hub` FOREIGN KEY (`HubId`) REFERENCES `hub` (`HubId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hub`
--

DROP TABLE IF EXISTS `hub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hub` (
  `HubId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  `IsDeleted` tinyint DEFAULT '0',
  PRIMARY KEY (`HubId`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hub_permissions`
--

DROP TABLE IF EXISTS `hub_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hub_permissions` (
  `HubRoleId` int NOT NULL,
  `PermissionId` int NOT NULL,
  PRIMARY KEY (`HubRoleId`,`PermissionId`),
  KEY `fk_hubpermissions_hubrole_idx` (`HubRoleId`),
  KEY `fk_hubpermissions_permissions_idx` (`PermissionId`),
  CONSTRAINT `fk_hubpermissions_hubrole` FOREIGN KEY (`HubRoleId`) REFERENCES `hub_role` (`HubRoleId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_hubpermissions_permissions` FOREIGN KEY (`PermissionId`) REFERENCES `permissions` (`PermissionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hub_role`
--

DROP TABLE IF EXISTS `hub_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hub_role` (
  `HubRoleId` int NOT NULL AUTO_INCREMENT,
  `HubId` int NOT NULL,
  `UserId` int NOT NULL,
  `Role` enum('Master','Member','Owner','Assistant','Teacher') NOT NULL,
  `IsOwner` tinyint DEFAULT '0',
  PRIMARY KEY (`HubRoleId`),
  KEY `fk_hub_idx` (`HubId`),
  KEY `fk_hub_teacher_idx` (`UserId`),
  CONSTRAINT `fk_hub` FOREIGN KEY (`HubId`) REFERENCES `hub` (`HubId`),
  CONSTRAINT `fk_hub_teacher` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `InvoiceId` int NOT NULL AUTO_INCREMENT,
  `ClassId` int DEFAULT NULL,
  `StudentId` int NOT NULL,
  `IsPaid` tinyint NOT NULL,
  `Version` int NOT NULL,
  `Amount` decimal(15,0) NOT NULL,
  `DueDate` date NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `UpdatedDate` datetime NOT NULL,
  PRIMARY KEY (`InvoiceId`),
  KEY `fk_invoice_class_idx` (`ClassId`),
  KEY `fk_invoice_student` (`StudentId`),
  CONSTRAINT `fk_invoice_class` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_invoice_student` FOREIGN KEY (`StudentId`) REFERENCES `student` (`StudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `PermissionId` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(45) NOT NULL,
  `Description` text,
  PRIMARY KEY (`PermissionId`),
  UNIQUE KEY `Code_UNIQUE` (`Code`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `record_attendance`
--

DROP TABLE IF EXISTS `record_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record_attendance` (
  `RecordAttendanceId` int NOT NULL AUTO_INCREMENT,
  `Present` enum('Present','Absent','Excused','Late','Unchecked') NOT NULL,
  `Score` int DEFAULT NULL,
  `IsFinishHomework` tinyint DEFAULT NULL,
  `Comment` text,
  `StudentId` int NOT NULL,
  `ClassId` int NOT NULL,
  `AttendanceDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RecordAttendanceId`),
  UNIQUE KEY `unique_student_date_class` (`StudentId`,`ClassId`,`AttendanceDate`),
  KEY `fk_record_student_idx` (`StudentId`),
  KEY `fk_record_class_idx` (`ClassId`),
  CONSTRAINT `fk_record_class` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_record_student` FOREIGN KEY (`StudentId`) REFERENCES `student` (`StudentId`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `ScheduleId` int NOT NULL AUTO_INCREMENT,
  `DaysOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `ClassId` int NOT NULL,
  PRIMARY KEY (`ScheduleId`),
  KEY `fk_class_schedule_idx` (`ClassId`),
  CONSTRAINT `fk_class_schedule` FOREIGN KEY (`ClassId`) REFERENCES `class` (`ClassId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `StudentId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `EnrollDate` date DEFAULT NULL,
  `Status` enum('Studying','Finished') DEFAULT 'Studying',
  `HubId` int NOT NULL,
  `FaceDescriptor` json DEFAULT NULL,
  `FaceImageUrl` text,
  `FaceImagePublicId` text,
  PRIMARY KEY (`StudentId`),
  KEY `fk_student_hub_idx` (`HubId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_homework`
--

DROP TABLE IF EXISTS `student_homework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_homework` (
  `StudentHomeworkId` int NOT NULL AUTO_INCREMENT,
  `ClassHomeworkId` int NOT NULL,
  `StudentId` int NOT NULL,
  `SubmittedDate` datetime DEFAULT NULL,
  `Status` enum('Pending','Submitted','Missed') DEFAULT 'Pending',
  `Grade` decimal(5,2) DEFAULT NULL,
  `Feedback` text,
  `UploadSubmission` text,
  `IsGraded` tinyint NOT NULL DEFAULT '0',
  `CreatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IsGradedByAI` tinyint NOT NULL DEFAULT '0',
  `SecurityStatus` varchar(20) DEFAULT 'None',
  `NeedsReview` tinyint(1) DEFAULT '0',
  `TimingStatus` enum('InTime','Overdue') DEFAULT NULL,
  PRIMARY KEY (`StudentHomeworkId`),
  UNIQUE KEY `unique_submission` (`ClassHomeworkId`,`StudentId`),
  KEY `fk_studenthomework_classhomework_idx` (`ClassHomeworkId`),
  KEY `fk_studenthomework_student_idx` (`StudentId`),
  CONSTRAINT `fk_studenthomework_classhomework` FOREIGN KEY (`ClassHomeworkId`) REFERENCES `class_homework` (`ClassHomeworkId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_studenthomework_student` FOREIGN KEY (`StudentId`) REFERENCES `student` (`StudentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student_homework_question`
--

DROP TABLE IF EXISTS `student_homework_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_homework_question` (
  `StudentHomeworkQuestionId` int NOT NULL AUTO_INCREMENT,
  `StudentHomeworkId` int NOT NULL,
  `QuestionNumber` int DEFAULT NULL,
  `Grade` decimal(3,1) DEFAULT NULL,
  `MaxGrade` decimal(3,0) DEFAULT NULL,
  `FeedBack` text,
  PRIMARY KEY (`StudentHomeworkQuestionId`),
  UNIQUE KEY `unique_question_grade` (`StudentHomeworkId`,`QuestionNumber`),
  KEY `fk_question_studenthomework_idx` (`StudentHomeworkId`),
  CONSTRAINT `fk_question_studenthomework` FOREIGN KEY (`StudentHomeworkId`) REFERENCES `student_homework` (`StudentHomeworkId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=755 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `HashedPassword` text NOT NULL,
  `Address` text,
  `Phone` varchar(10) DEFAULT NULL,
  `IsAdmin` tinyint NOT NULL DEFAULT '0',
  `Role` enum('Teacher','Student','Admin') DEFAULT NULL,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-10 18:15:02
