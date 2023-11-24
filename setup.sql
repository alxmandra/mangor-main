CREATE TABLE IF NOT EXISTS `mangor_photoalbum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(150) NOT NULL,
  `image_title` varchar(150) NOT NULL,
  `image_author` varchar(50) NOT NULL,
  `image_description` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;