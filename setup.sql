-- CREATE TABLE IF NOT EXISTS `mangor_photoalbum` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `image_path` varchar(150) NOT NULL,
--   `image_title` varchar(150) NOT NULL,
--   `image_author` varchar(50) NOT NULL,
--   `image_description` varchar(150) NOT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
-- CREATE DATABASE IF NOT EXISTS `photos` COLLATE 'utf8mb4_unicode_ci';

CREATE DATABASE IF NOT EXISTS `photos` COLLATE 'utf8mb4_unicode_ci';
CREATE USER IF NOT EXISTS 'gorman'@'%' IDENTIFIED BY 'gorman';
GRANT ALTER, CREATE, CREATE VIEW, DELETE, DROP, INDEX, INSERT, REFERENCES, SELECT, SHOW VIEW, TRIGGER, UPDATE ON `photos`.* TO 'gorman'@'%';