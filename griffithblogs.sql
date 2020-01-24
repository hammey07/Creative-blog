-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2019 at 12:31 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `griffithblogs`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `blog_id` int(40) NOT NULL,
  `blog_title` varchar(255) NOT NULL,
  `author_id` int(11) NOT NULL,
  `author_name` varchar(100) NOT NULL,
  `blog_publish_date` date NOT NULL,
  `blog_image` varchar(255) NOT NULL,
  `blog_description` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`blog_id`, `blog_title`, `author_id`, `author_name`, `blog_publish_date`, `blog_image`, `blog_description`) VALUES
(1, 'Web Development using Drupal', 1, 'Hammad Saleem', '2019-04-02', 'drupal.png', 'Drupal is an open source platform for building amazing digital experiences. It is made by a dedicated community. Anyone can use it, and it will always be free.'),
(2, 'Android Studio', 9, 'John Doe', '2014-03-03', 'android.jpg', 'Andorid studio'),
(4, 'Eclipse', 7, 'Jane Doe', '2019-04-07', 'eclipse.png', 'We are providing copies of the Eclipse logo so our community can use it to show their support of Eclipse and link back to our community. These logos are the intellectual property of the Eclipse Foundation and cannot be altered without Eclipse’s permission. They are provided for use under the Eclipse logo and trademark guidelines.'),
(5, 'Google Firebase', 9, 'Firebase', '2019-04-01', 'firebase.png', 'Firebase is Google&#x27;s mobile platform that helps you quickly develop high-quality apps and grow your business.'),
(6, 'JavaScript and Its Benefits', 8, 'Richard', '2019-04-01', 'js.png', 'JavaScript is the programming language of HTML and the Web. JavaScript is easy to learn. This tutorial will teach you JavaScript from basic to advanced.'),
(7, 'Php programming language', 6, 'PHP administration', '2018-12-25', 'php.png', 'PHP is a popular general-purpose scripting language that is especially suited to web development.\r\n\r\nFast, flexible and pragmatic, PHP powers everything from your blog to the most popular websites in the world.'),
(8, 'MySQL database and its features', 5, 'Wikipedia', '2019-02-02', 'mysql.png', 'MySQL is free and open-source software under the terms of the GNU General Public License, and is also available under a variety of proprietary licenses. MySQL was owned and sponsored by the Swedish company MySQL AB, which was bought by Sun Microsystems (now Oracle Corporation).[8] In 2010, when Oracle acquired Sun, Widenius forked the open-source MySQL project to create MariaDB.'),
(9, 'MongoDB Database', 4, 'Tom Jerry', '2019-04-11', 'mongoDB.png', 'MongoDB allows your teams to easily organize, use and enrich data – in real time, anywhere.\r\nThe best MongoDB experience. Access data directly from your frontend code, intelligently distribute data for global apps, trigger serverless functions in response to data changes, and much more.'),
(10, 'Griffith Alumni', 3, 'Fiona Sullivan', '2018-08-21', 'griffith.jpg', 'Now that you have graduated, make the most of your Griffith College affiliation by joining the Griffith Alumni Network.\r\n\r\nImagine an online social networking site, but only for people with present and past Griffith College connections, who want to stay in touch, share job openings, become mentors and more. Welcome to the Griffith Alumni Network! The Griffith Alumni Network is an exclusive online alumni community where you can find your college friends, develop mentoring and networking relationships, join industry or local chapters, and post events and photos, all in a supportive and welcoming community.\r\n\r\nThe Network is also available to Griffith students in their final year of study. This is a great way to find a mentor, search for internships or jobs, and prepare for life after college.\r\n\r\nTo understand how the Griffith Alumni Network works, click on the Griffith Alumni Network guide below.'),
(11, 'LinkedIn provides you to explore new opportunities', 3, 'Jerry', '2019-02-12', 'linkedin.png', '500 million+ members | Manage your professional identity. Build and engage with your professional network. Access knowledge, insights and opportunities.'),
(12, 'IntelliJ - The amazing IDE', 2, 'Lauren Grehan', '2019-04-10', 'intellij.png', 'IntelliJ IDEA is a Java integrated development environment for developing computer software. It is developed by JetBrains, and is available as an Apache 2 Licensed community edition, and in a proprietary commercial edition. Both can be used for commercial development');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'user6', '$2a$10$C2evjagTkTLvVAaaNGWUYOkCtUiNaDuJjHkZItlf3taL5PnV7Up4G'),
(2, 'hammad', '$2a$10$gs79SXsesFzbrwQOdQF2Guy60P662AFB5ysI3FUIajUwTcVZPYbp6'),
(3, 'a', '$2a$10$RzsIs3UnNlwyPeR5v80CJeDiDkcdUx5x7eS8zcyI/XJ7CYRkLf96a'),
(4, 'z', '$2a$10$A7S417h/PKFQiYnfrZOClev/3etq42HzeY.DsP/CeesjaSDrNJMwK'),
(5, 'tim', '$2a$10$AUKeNJblOmdAcdgk1UaYHOBbEkCtJdZhWeoHScoIFw3wtrH1FXrZW'),
(6, 'g', '$2a$10$CszRQAirZBTFmmzRBJsihOU0fvAhkdPOY3cOq3fgQZu.RYeOti//m'),
(7, 'user0', '$2a$10$DUTjVJkorc71WPnMPI90u.KuFkbF3Hxr4.qGVaknzrx3uIpCRZuru'),
(8, 'user9', '$2a$10$GVnlXrVbFvscVTHnjj.GAOLcRd7qEZKphfkoiXjoUr..VPrc3htV2'),
(9, 'user10', '$2a$10$0DHuFP/YcMlwYt7hSU7MkOQVKkRj2wpPqQOJeRYkyt6nQ9J8t6Lr6'),
(10, 'd', '$2a$10$PIOUHhDgEtvAZ6hX9x5U9Oq9gxw7NMsVkKt4ghxJVDpkaFkQLsARK'),
(11, 'user1', '$2a$10$XQDZWnVfOcwl.UDayz/vXu5vB5LrsZmyyVt.Zxk5HLbIZvYtYai.u');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`blog_id`),
  ADD KEY `author_to_user_id` (`author_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `blog_id` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `author_to_user_id` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
