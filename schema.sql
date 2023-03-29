DROP TABLE IF EXISTS `assign`;
CREATE TABLE `assign` (
  `user_id` int NOT NULL,
  `link_id` char(11) NOT NULL,
  PRIMARY KEY (`user_id`,`link_id`),
  KEY `link_id` (`link_id`),
  CONSTRAINT `assign_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assign_ibfk_2` FOREIGN KEY (`link_id`) REFERENCES `zoom_link` (`link_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `password` char(128) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `email` varchar(255) NOT NULL,
  `adminConfirmed` tinyint(1) DEFAULT '0',
  `firstTime` tinyint(1) DEFAULT '1',
  `theme` int DEFAULT '0',
  `passchangetime` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `zoom_link`;
CREATE TABLE `zoom_link` (
  `link_id` char(11) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `pwd` varchar(200) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `url` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `access_level` tinyint DEFAULT '0',
  PRIMARY KEY (`link_id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
