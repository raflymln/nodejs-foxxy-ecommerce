-- phpMyAdmin SQL Dump
-- version 5.1.0-rc1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2021 at 03:45 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foxxy`
--

-- --------------------------------------------------------

--
-- Table structure for table `banned_ip`
--

CREATE TABLE `banned_ip` (
  `id` int(11) NOT NULL,
  `ip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `product_id` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `email_subscriber`
--

CREATE TABLE `email_subscriber` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone_number` varchar(191) NOT NULL,
  `gender` set('Not Specified','Male','Female') NOT NULL DEFAULT 'Not Specified',
  `name_first` varchar(191) NOT NULL,
  `name_last` varchar(191) NOT NULL,
  `password` text NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `banned` tinyint(1) NOT NULL DEFAULT 0,
  `banned_reason` longtext DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `token` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp(),
  `last_ip` varchar(191) DEFAULT NULL,
  `last_useragent` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Main Users Database';

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `short_description` longtext NOT NULL,
  `full_description` longtext NOT NULL,
  `banner` varchar(255) NOT NULL DEFAULT 'https://picsum.photos/seed/4567/200/300',
  `tags` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`id`, `name`, `short_description`, `full_description`, `banner`, `tags`) VALUES
(1, 'Servers', 'Basic independent virtual machine instances equipped with great hardware designed for great production system.', '## About VPS\r\nBasic independent virtual machine instances equipped with great hardware designed for great production system.\r\n\r\n- Extendable\r\n- Long Contract-term Period Available\r\n- Free DDOS Protection\r\n- Free OS Reinstall\r\n- VNC Access Included\r\n\r\n### 1. Setup Price & Contract Period\r\n\r\nOnly paid on first month for new server only. If the previous server was extended before the expired period, no setup fees needed.\r\n\r\nSetup Price are differents, depends on the contract period.\r\n\r\n```\r\na. 1 Month: $6.41 (Rp90.000)\r\nb. 3 Month: $5.34 (Rp75.000)\r\nc. 6 Month: $3.56 (Rp50.000)\r\nd. 12 Month: Free!\r\n```\r\n\r\n### 2. Server Hardware/Information\r\n```\r\n1. CPU: Intel(R) Xeon(R) CPU E5-2630 v4 @ 2.20GHz\r\n2. Storage: NVMe SSD\r\n3. Virtualization: KVM\r\n4. Vendor: QEMU\r\n```\r\n\r\n### 3. Default Configuration\r\n```\r\n1. OS: Ubuntu, CentOS, plesk, cPanel, Webmin (Free)\r\n2. Default Datacenter: Germany (Free)\r\n```', 'https://nitrocdn.com/oAOSIeTXlvqbvIBOBzqBJSMUJAbQVUWj/assets/static/optimized/rev-edd6777/wp-content/uploads/2020/03/banner-vector-img-1.png', 'vps'),
(2, 'Shared Hosting', 'Cheap flexible and customized hosting service with a great hardware specification. The price here is set according to the amount of RAM, but you can adjust it according to your needs.', 'Shared hosting is a type of web hosting where a single physical server hosts multiple sites. Many users utilize the resources on a single server, which keeps the costs low. Users each get a section of a server in which they can host their website files. Shared servers can hosts hundreds of users.', 'https://www.ewebguru.net/img/linux-vps-safe.png', NULL),
(3, 'Streaming Account', 'Newly created or family accounts for streaming application.', 'No Description Available', 'https://www.nxtbookmedia.com/wp-content/uploads/2014/06/netflix.png', NULL),
(4, 'E-Wallet', 'E-wallet balance topup or converter, or others things related to finance.', 'No Description Available', 'https://pest-solutions.co.uk/wp-content/uploads/2016/07/pay-with-paypal.jpg', NULL),
(5, 'Game Voucher', 'Voucher for your online/offline game needs', 'No Description Available', 'https://www.greenmangaming.com/newsroom/wp-content/uploads/2019/11/steam-valve-blog.jpg', NULL),
(6, 'Game Account', 'Newly or ex-used game account for you to play.', 'No Description Available.', 'https://www.portalgaming.id/wp-content/uploads/2020/08/LvNXk2LvkwfFxhgUk2j5WL.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_list`
--

CREATE TABLE `product_list` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL DEFAULT 1,
  `name` varchar(255) NOT NULL,
  `price` int(10) NOT NULL DEFAULT 0,
  `setup_price` int(10) NOT NULL DEFAULT 0,
  `stock` int(3) NOT NULL,
  `duration` int(15) NOT NULL DEFAULT 1,
  `store` varchar(255) NOT NULL DEFAULT 'Foxxy',
  `short_description` varchar(255) NOT NULL DEFAULT 'No Short Description Available',
  `banner` varchar(255) NOT NULL DEFAULT 'https://picsum.photos/seed/1234/200/300',
  `label` set('No Label','Discount','Instant','Preorder','') NOT NULL DEFAULT 'No Label',
  `extendable` tinyint(1) NOT NULL DEFAULT 0,
  `stackable` tinyint(1) NOT NULL DEFAULT 0,
  `maximum_purchase` int(3) NOT NULL DEFAULT 0,
  `full_description` longtext DEFAULT NULL,
  `tags` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_list`
--

INSERT INTO `product_list` (`id`, `category_id`, `name`, `price`, `setup_price`, `stock`, `duration`, `store`, `short_description`, `banner`, `label`, `extendable`, `stackable`, `maximum_purchase`, `full_description`, `tags`) VALUES
(1, 1, 'VPS X Blue', 110000, 90000, 998, 30, 'Contabo', '4 vCPU Cores | 8 GB RAM | 200 GB SSD | 200 Mbit/s Port', 'https://image.freepik.com/free-vector/computer-technology-isometric-icon-server-room-digital-device-set-element-design-pc-laptop_39422-1026.jpg', 'Preorder', 1, 0, 1, '# Specification \r\n4 vCPU Cores  \r\n8 GB RAM  \r\n200 GB SSD  \r\n200 Mbit/s Port  \r\n1 Snapshot  \r\n\r\n[BUY]', ''),
(2, 1, 'VPS X Red', 170000, 90000, 999, 30, 'Contabo', '6 vCPU Cores | 16 GB RAM | 400 GB SSD | 400 Mbit/s Port | 2 Snapshots', 'https://image.freepik.com/free-vector/computer-technology-isometric-icon-server-room-digital-device-set-element-design-pc-laptop_39422-1026.jpg', 'Preorder', 1, 0, 1, 'No Description Available', ''),
(3, 1, 'VPS X Green', 270000, 90000, 999, 30, 'Contabo', '8 vCPU Cores | 30 GB RAM | 800 GB SSD | 600 Mbit/s Port | 3 Snapshots', 'https://image.freepik.com/free-vector/computer-technology-isometric-icon-server-room-digital-device-set-element-design-pc-laptop_39422-1026.jpg', 'Preorder', 1, 0, 1, 'No Description Available', ''),
(4, 1, 'VPS X Orange', 480000, 90000, 999, 30, 'Contabo', '10 vCPU Cores | 60 GB RAM | 1.6 TB SSD | 1 Gbit/s Port | 4 Snapshots', 'https://image.freepik.com/free-vector/computer-technology-isometric-icon-server-room-digital-device-set-element-design-pc-laptop_39422-1026.jpg', 'Preorder', 1, 0, 1, 'No Description Available', ''),
(8, 3, 'Netflix Private', 90000, 0, 120, 30, 'Foxxy', '1 Account with 4 device usage at the same time', 'https://assets.brand.microsites.netflix.io/assets/493f5bba-81a4-11e9-bf79-066b49664af6_cm_1440w.png?v=49', 'No Label', 0, 0, 2, 'No Description Available', 'netflix'),
(9, 3, 'Spotify Family', 15000, 0, 79, 30, 'Foxxy', 'Indonesia Region Spotify Family Premium Package', 'https://gadgetren.com/wp-content/uploads/2020/02/Spotify-Logo.jpg', 'No Label', 0, 0, 2, 'No Description Available', 'spotify, spotify family,spotify indonesia,spotify id'),
(10, 3, 'Spotify Family US Region', 10000, 0, 10, 30, 'Foxxy', 'US Region Spotify Family Premium Package', 'https://gadgetren.com/wp-content/uploads/2020/02/Spotify-Logo.jpg', 'No Label', 0, 0, 2, 'No Description Available', 'spotify,spotify family,spotify us, spotify amerika'),
(11, 3, 'Disney Hotstar', 50000, 0, 10, 30, 'Foxxy', '1 Account with 2 device usage at the same time', 'https://i.gadgets360cdn.com/large/disney_plus_hotstar_logo_1583901149861.jpg?downsize=950:*&output-quality=80', 'No Label', 0, 0, 2, 'No Description Available', 'disney'),
(12, 4, 'Paypal Balance', 14500, 0, 10, 1, 'Foxxy', 'Rate Per USD 1', 'https://pest-solutions.co.uk/wp-content/uploads/2016/07/pay-with-paypal.jpg', 'Discount', 0, 1, 0, 'No Description Available', 'paypal'),
(13, 4, 'DANA Balance', 11500, 0, 10, 1, 'Foxxy', 'Rate Per IDR 10.000', 'https://i.pinimg.com/originals/09/f2/1c/09f21cba101dc1c12bb26bd80f222f8e.png', 'No Label', 0, 1, 2, 'No Description Available', 'dana'),
(14, 4, 'GO PAY Balance', 12000, 0, 10, 1, 'Foxxy', 'Rate Per IDR 10.000', 'https://1.bp.blogspot.com/-R4r4JM-C8ao/X-WV4d17OUI/AAAAAAAAFvM/kkmwQRWd_BQ8hdayC0yMD8HZIkzUeRWaACLcBGAsYHQ/s364/Screenshot_2020_1225_153253.png', 'No Label', 0, 1, 2, 'No Description Available', 'gopay,gojek'),
(15, 4, 'GO PAY Driver Balance', 11000, 0, 10, 1, 'Foxxy', 'Rate Per IDR 10.000', 'https://1.bp.blogspot.com/-R4r4JM-C8ao/X-WV4d17OUI/AAAAAAAAFvM/kkmwQRWd_BQ8hdayC0yMD8HZIkzUeRWaACLcBGAsYHQ/s364/Screenshot_2020_1225_153253.png', 'No Label', 0, 1, 2, 'No Description Available', 'gopay,gojek,driver'),
(16, 4, 'GRAB Balance', 22000, 0, 10, 1, 'Foxxy', 'Rate Per IDR 20.000', 'https://i.pinimg.com/originals/75/a6/a5/75a6a51ba091ec212aa034e611db63a3.png', 'No Label', 0, 1, 2, 'No Description Available', 'grab'),
(17, 4, 'GRAB Driver Balance', 101000, 0, 10, 1, 'Foxxy', 'Rate Per IDR 100.000', 'https://i.pinimg.com/originals/75/a6/a5/75a6a51ba091ec212aa034e611db63a3.png', 'No Label', 0, 1, 2, 'No Description Available', 'grab, grab driver, drive'),
(18, 4, 'LINKAJA Balance', 11500, 0, 10, 1, 'Foxxy', 'Rate Per IDR 10.000', 'https://pbs.twimg.com/profile_images/1098571061161975808/yd3I7dlO_400x400.png', 'No Label', 0, 1, 2, 'No Description Available', 'linkaja'),
(19, 4, 'OVO Balance', 22000, 0, 10, 1, 'Foxxy', 'Rate Per IDR 20.000', 'https://i.pinimg.com/originals/61/c9/8a/61c98a1dffc2e04424d592564cef941f.png', 'No Label', 0, 1, 2, 'No Description Available', 'ovo'),
(20, 4, 'TIX Balance', 12000, 0, 10, 1, 'Foxxy', 'Rate Per IDR 10.000', 'https://gadgetren.com/wp-content/uploads/2019/03/TIX-ID-Logo-Feature-1200x720.jpg', 'No Label', 0, 1, 2, 'No Description Available', 'tix'),
(22, 3, 'Netflix Private 3 Month', 220000, 0, 10, 90, 'Foxxy', '3 Month Version | 1 Account with 4 device usage at the same time', 'https://assets.brand.microsites.netflix.io/assets/493f5bba-81a4-11e9-bf79-066b49664af6_cm_1440w.png?v=49', 'Discount', 0, 0, 2, 'No Description Available', 'netflix'),
(23, 3, 'Netflix Shared', 30000, 0, 10, 30, 'Foxxy', '1 device usage at the same time', 'https://assets.brand.microsites.netflix.io/assets/493f5bba-81a4-11e9-bf79-066b49664af6_cm_1440w.png?v=49', 'No Label', 0, 0, 2, 'No Description Available', 'netflix');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` int(11) NOT NULL,
  `transaction_id` int(5) NOT NULL,
  `product_id` int(5) NOT NULL,
  `member_id` int(5) NOT NULL,
  `reviews` longtext NOT NULL,
  `stars` int(11) NOT NULL,
  `date` varchar(255) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `transaction_id` varchar(191) NOT NULL,
  `transaction_additional_information` longtext DEFAULT NULL,
  `product_id` varchar(255) NOT NULL,
  `product_amount` int(11) DEFAULT NULL,
  `product_price` int(11) NOT NULL,
  `product_store` varchar(255) NOT NULL,
  `product_description` longtext DEFAULT 'No Description Available',
  `payment_method` varchar(191) NOT NULL,
  `payment_gateway` varchar(255) NOT NULL,
  `payment_status` set('UNPAID','PAID','REFUND','EXPIRED','FAILED') NOT NULL DEFAULT 'UNPAID',
  `product_status` set('PENDING','ACTIVE','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `date_purchased` varchar(255) DEFAULT NULL,
  `date_expired` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banned_ip`
--
ALTER TABLE `banned_ip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_subscriber`
--
ALTER TABLE `email_subscriber`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_list`
--
ALTER TABLE `product_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banned_ip`
--
ALTER TABLE `banned_ip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_subscriber`
--
ALTER TABLE `email_subscriber`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_list`
--
ALTER TABLE `product_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
