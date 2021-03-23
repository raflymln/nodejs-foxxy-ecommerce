-- phpMyAdmin SQL Dump
-- version 5.1.0-rc1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2021 at 01:01 PM
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
  `product_id` int(15) NOT NULL,
  `product_variant_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `additional_information` longtext DEFAULT 'No Additional Information'
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

--
-- Dumping data for table `email_subscriber`
--

INSERT INTO `email_subscriber` (`id`, `email`, `ip`) VALUES
(1, 'mraflymaulana@gmail.com', '36.79.249.182');

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
  `created_at` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL,
  `last_ip` varchar(191) DEFAULT NULL,
  `last_useragent` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Main Users Database';

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `username`, `email`, `phone_number`, `gender`, `name_first`, `name_last`, `password`, `admin`, `verified`, `banned`, `banned_reason`, `created_at`, `token`, `updated_at`, `last_ip`, `last_useragent`) VALUES
(1, 'raflymln', 'mraflymaulana@gmail.com', '+6281806769563', 'Male', 'Rafly', 'Maulana', '285ca65cc8783f65e02de7988aebeae0', 0, 0, 0, NULL, '2021-03-15 11:13:42', NULL, 'Sun, 21 Mar 2021 14:08:29 GMT', '::ffff:127.0.0.1', '{\"browser\":\"Chrome\",\"version\":\"89.0.4389.90\",\"os\":\"Windows 10.0\",\"platform\":\"Microsoft Windows\"}'),
(2, 'hkldtrinanda', 'hkldtrinanda12@gmail.com', '+6282118526214', 'Not Specified', 'Haikal Danung', 'Trinanda', '0d6ccb129f9140b462e5925b8b8b0579', 0, 0, 0, NULL, 'Mon, 15 Mar 2021 16:38:32 GMT', NULL, 'Mon, 15 Mar 2021 16:39:27 GMT', '140.213.190.229', '{\"browser\":\"Opera\",\"version\":\"73.0.3856.415\",\"os\":\"Windows 10.0\",\"platform\":\"Microsoft Windows\"}'),
(3, 'Broth', 'broth@icanse.eu.org', '+6288888888888', 'Not Specified', 'Brian', 'Roth', '5ffa7187e5f37e222da5906fda4d20d2', 0, 0, 0, NULL, 'Tue, 16 Mar 2021 01:38:59 GMT', NULL, 'Tue, 16 Mar 2021 01:40:00 GMT', '103.143.100.217', '{\"browser\":\"Chrome\",\"version\":\"86.0.0.0\",\"os\":\"Linux\",\"platform\":\"Android\"}'),
(4, 'Pilzoou', 'nurulfirdausfirdaus50872@gmail.com', '+6285239178903', 'Male', 'Pilzoou', 'Pilzoou', '1b72f78daac3751b60682ade1936330b', 0, 0, 0, NULL, 'Wed, 17 Mar 2021 01:27:38 GMT', NULL, 'Wed, 17 Mar 2021 01:29:35 GMT', '182.2.36.1', '{\"browser\":\"Chrome\",\"version\":\"89.0.4389.82\",\"os\":\"Windows 7\",\"platform\":\"Microsoft Windows\"}'),
(5, 'syaefulajaib29', 'syaefulaep29@gmail.com', '+6281283762671', 'Male', 'syaeful', 'ajaib', 'ba5057d301fb14a057ba8f3d2e5cd2e9', 0, 0, 0, NULL, 'Wed, 17 Mar 2021 05:37:15 GMT', NULL, 'Wed, 17 Mar 2021 05:38:01 GMT', '125.161.129.216', '{\"browser\":\"Edge\",\"version\":\"89.0.774.54\",\"os\":\"Windows 10.0\",\"platform\":\"Microsoft Windows\"}'),
(6, 'ZEEID21', 'zidanevos2@gmail.com', '+6285159901629', 'Not Specified', 'ZIDAN', 'YULIYANTO ', '7cc93d8438fc5fe90c8377799003ed10', 0, 0, 0, NULL, 'Wed, 17 Mar 2021 05:44:42 GMT', NULL, 'Wed, 17 Mar 2021 05:48:59 GMT', '110.138.95.116', '{\"browser\":\"Opera\",\"version\":\"73.0.3856.415\",\"os\":\"Windows 10.0\",\"platform\":\"Microsoft Windows\"}');

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `banner` varchar(255) NOT NULL DEFAULT 'https://picsum.photos/seed/4567/200/300',
  `tags` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`id`, `name`, `description`, `banner`, `tags`) VALUES
(1, 'Servers', 'Basic independent virtual machine instances equipped with great hardware designed for great production system.', 'https://d2m5g5c8r27ogi.cloudfront.net/neutral/c/b52/cb5271e.jpg', 'vps'),
(2, 'Shared Hosting', 'A cheap hosting, shared resources with other users, provided for you to host your game easily and start playing together with your friends!', 'https://img.gta5-mods.com/q75/images/meeting-point-fivem-single-player-ymap-xml/13877f-1.png', 'fivem, mchost, pterodactyl, ptero, panel'),
(3, 'E-Wallet', 'E-wallet balance topup or converter, or others things related to finance.', 'https://pest-solutions.co.uk/wp-content/uploads/2016/07/pay-with-paypal.jpg', NULL),
(4, 'Game Voucher', 'Voucher for your online/offline game needs', 'https://www.greenmangaming.com/newsroom/wp-content/uploads/2019/11/steam-valve-blog.jpg', NULL),
(5, 'Game Account', 'Newly or ex-used game account for you to play.', 'https://www.portalgaming.id/wp-content/uploads/2020/08/LvNXk2LvkwfFxhgUk2j5WL.jpg', NULL),
(6, 'Application', 'A premium account/upgrade of utility application.', 'https://1000logos.net/wp-content/uploads/2020/02/Canva-logo.jpg', NULL),
(7, 'Streaming Application', 'Newly created or family accounts for streaming application.', 'https://www.nxtbookmedia.com/wp-content/uploads/2014/06/netflix.png', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_list`
--

CREATE TABLE `product_list` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL DEFAULT 1,
  `store_id` int(11) NOT NULL DEFAULT 1,
  `name` varchar(255) NOT NULL,
  `description` longtext DEFAULT '\'NULL\'',
  `banner` varchar(255) NOT NULL DEFAULT 'https://picsum.photos/seed/1234/200/300',
  `label` set('No Label','Discount','Instant','Preorder','') NOT NULL DEFAULT 'No Label',
  `tags` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_list`
--

INSERT INTO `product_list` (`id`, `category_id`, `store_id`, `name`, `description`, `banner`, `label`, `tags`) VALUES
(1, 1, 2, 'VPS SSD Linux', '# Specification\r\n**VPS S SSD**\r\n1. 4 vCPU Cores\r\n2. 8 GB RAM\r\n3. 200 GB SSD\r\n4. 200 Mbit/s Port\r\n5. 1 Snapshot\r\n\r\n**VPS M SSD**\r\n1. 6 vCPU Cores\r\n2. 16 GB RAM\r\n3. 400 GB SSD\r\n4. 400 Mbit/s Port\r\n5. 2 Snapshot\r\n\r\n**VPS L SSD**\r\n1. 8 vCPU Cores\r\n2. 30 GB RAM\r\n3. 800 GB SSD\r\n4. 600 Mbit/s Port\r\n5. 3 Snapshot\r\n\r\n**VPS XL SSD**\r\n1. 10 vCPU Cores\r\n2. 60 GB RAM\r\n3. 1.6 TB SSD\r\n4. 1 Gbit/s Port\r\n5. 4 Snapshot\r\n\r\n+ KVM Virtualization\r\n+ Include 1 IPv4 Address\r\n+ Location Germany (EU)\r\n\r\n# OS Selection\r\n1. Ubuntu 18.04/20.04\r\n2. CentOS 7/8\r\n3. Debian 9/10\r\n4. Fedora 32/33\r\n5. OpenSuse\r\n6. ArchLinux\r\n7. FreeBSD\r\n\r\n# Terms of Service\r\n- If not OS is specified, a random OS will be selected', 'https://d2m5g5c8r27ogi.cloudfront.net/neutral/c/b52/cb5271e.jpg', 'Preorder', ''),
(2, 1, 3, 'RDP Windows', '# Features\r\n- CPU: AMD EPYC 7601\r\n- Provider: Linode\r\n\r\n# OS\r\n- Windows Server 2012\r\n- Windows Server 2016\r\n- Windows Server 2019\r\n\r\n# Specification\r\n**Green**\r\n- Core: 2 CPUs\r\n- RAM: 4 GB \r\n- Storage: SSD 80 GB\r\n\r\n**Red**\r\n- Core: 4 CPUs\r\n- RAM: 8 GB \r\n- Storage: SSD 160 GB\r\n\r\n**Blue**\r\n- Core: 6 CPUs\r\n- RAM: 16 GB \r\n- Storage: SSD 320 GB\r\n\r\n# Terms of Service\r\n- If not OS is specified, a random OS will be selected\r\n- No mining support', 'https://kit8.net/wp-content/uploads/2020/12/server@2x-1.png', 'Preorder', NULL),
(3, 3, 1, 'Paypal', '# Terms of service\n- Please provide you account number/id on the transaction additional info\n- You\'ll be transferred the amount of the purchase to your account', 'https://pest-solutions.co.uk/wp-content/uploads/2016/07/pay-with-paypal.jpg', 'Discount', 'paypal'),
(4, 3, 1, 'DANA', '# Terms of service\n- Please provide you account number/id on the transaction additional info\n- You\'ll be transferred the amount of the purchase to your account', 'https://i.pinimg.com/originals/09/f2/1c/09f21cba101dc1c12bb26bd80f222f8e.png', 'No Label', 'dana'),
(5, 3, 1, 'GO PAY', '# Terms of service\n- Please provide you account number/id on the transaction additional info\n- You\'ll be transferred the amount of the purchase to your account', 'https://1.bp.blogspot.com/-R4r4JM-C8ao/X-WV4d17OUI/AAAAAAAAFvM/kkmwQRWd_BQ8hdayC0yMD8HZIkzUeRWaACLcBGAsYHQ/s364/Screenshot_2020_1225_153253.png', 'No Label', 'gopay,gojek'),
(6, 3, 1, 'OVO Balance', '# Terms of service\n- Please provide you account number/id on the transaction additional info\n- You\'ll be transferred the amount of the purchase to your account', 'https://i.pinimg.com/originals/61/c9/8a/61c98a1dffc2e04424d592564cef941f.png', 'No Label', 'ovo'),
(7, 4, 1, 'Steam Wallet IDR', '# Terms of Service\r\n- You\'ll given the Steam Wallet Code\r\n- Redeem the code on your steam account', 'https://www.greenmangaming.com/newsroom/wp-content/uploads/2019/11/steam-valve-blog.jpg', 'Instant', NULL),
(8, 4, 1, 'Google Play Voucher', '# Terms of Service\r\n- You\'ll be given the voucher code', 'https://i1.wp.com/brilliansolution.com/wp-content/uploads/2017/11/google-play.png', 'Instant', NULL),
(9, 4, 1, 'PUBG Mobile UC', '# Terms of Service\r\n- Please provide your in-game name/nickname and your user id (Example: User, 12345678)\r\n- Data writing errors are beyond our responsibility', 'https://w7.pngwing.com/pngs/227/957/png-transparent-playerunknown-s-battleground-mobile-logo-logo-arcade-game-playerunknown-s-battlegrounds-font-text-playerunknown-s-battlegrounds-logo-logo-arcade-game-playerunknown-s-battlegrounds.png', 'No Label', NULL),
(10, 4, 1, 'Free Fire Diamonds', '# Terms of Service\r\n- Please provide your in-game name/nickname and your user id (Example: User, 12345678)\r\n- Data writing errors are beyond our responsibility', 'https://www.exchange4media.com/news-photo/99118.freefiremain.jpg', 'No Label', NULL),
(11, 5, 1, 'Minecraft', '# Features\r\n**Full Access**\r\n- Full access to all settings\r\n- Anti Revoke\r\n- Unbanned Hypixel\r\n\r\n**Semi Full Access**\r\n- Full access to all settings\r\n- Can be Revoked\r\n- Unbanned Hypixel\r\n\r\n# Terms of Service\r\n**Full Access**\r\n- You\'ll be given an Email and Password for the Minecraft account\r\n- Warranty applies after you\'ve moved the account to your account\r\n\r\n**Semi Full Access**\r\n- You\'ll be given an Email and Password for the Minecraft account\r\n- You can change only the account SKIN, USERNAME, and PASSWORD', 'https://cdn1-production-images-kly.akamaized.net/GxNYjvM1FtSDNMYHrPhD76wwGWs=/673x379/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3258079/original/050751000_1601880324-minecraft-01.jpg', 'Instant', NULL),
(12, 6, 1, 'Google Drive', '# Features\r\n- Unlimited Storage Box\r\n- Custom Username Request\r\n- Unlimited Active Time\r\n- Shared Drive Available\r\n\r\n# Terms of Service\r\n- If you wish to have custom username, please provide it on the transaction additional info. If the username you ask is not available, we\'ll notified you about it. And if after 1 day there is no any response, we\'ll proceed with a random username\r\n- Your account have unlimited active time, but we only provide 30 days warranty.\r\n- Please follow Google Drive Terms of Service, any violation will void the applicable warranty', 'https://i.insider.com/5f1ef88ef34d0525d67ebca8?width=700', 'Preorder', NULL),
(13, 6, 1, 'Canva', '# Features\r\n- More than 1000 fonts or upload your own\r\n- Over 4 million photos & elements\r\n- Access to premium animations\r\n- Unlimited project folder\r\n\r\n# Terms of Service\r\n- Account is from us\r\n- Do not change anything on the account settings, \r\n- Breaking the rules will result in you being unable to purchase this product again', 'https://hostingtribunal.com/wp-content/uploads/2020/10/Canva-Logo.jpg', 'Preorder', NULL),
(14, 7, 1, 'Netflix Indonesia', '# Features\r\n**Private**\r\n- 4K Ultra HD quality\r\n- Get 4 Profile (4 Screen Play / 4 Device)\r\n- Can be used on Smart TV, Mobile, Laptop, PS4, iPad, Tablet, Xbox and other devices\r\n- Anti On Hold & Banned\r\n\r\n**Shared**\r\n- 4K Ultra HD quality\r\n- Get 1 Profile (1 Device only)\r\n- Can be used on Smart TV, Mobile, Laptop, PS4, iPad, Tablet, Xbox and other devices\r\n- Anti On Hold & Banned\r\n\r\n# Terms of Service\r\n- Account is given from us\r\n\r\n**Private**\r\n- You **CAN\'T** change the email, but you **CAN** change the profile and the password\r\n\r\n**Shared**\r\n- You **ONLY CAN** change your profile name and profile lock password', 'https://assets.brand.microsites.netflix.io/assets/493f5bba-81a4-11e9-bf79-066b49664af6_cm_1440w.png?v=49', 'No Label', 'netflix'),
(15, 7, 1, 'Spotify', '# Features\n- High Quality Streaming\n- No Advertisement\n- Include Song Downloader & Offline Mode Feature\n- Can Shuffle Track Without Limit\n\n# Terms of Service\n- You\'ll be given a family invite link to join to our account', 'https://gadgetren.com/wp-content/uploads/2020/02/Spotify-Logo.jpg', 'No Label', 'spotify, spotify family,spotify indonesia,spotify id'),
(16, 7, 1, 'Disney+ Hotstar Indonesia', '# Features\n- Global hits from Marvel, Disney and more\n- Exclusive Indonesian Premieres\n- Never-before-seen Disney+ Originals\n- Disney all time epics in one place\n- High Definition Quality Stream\n\n# Terms of Service\n- Account from us\n- Log in using the phone number and code from the admin\n- **ONLY** accessible for 1 device', 'https://i.gadgets360cdn.com/large/disney_plus_hotstar_logo_1583901149861.jpg?downsize=950:*&output-quality=80', 'No Label', 'disney'),
(17, 7, 1, 'iQIYI', '# Features\r\n- HD 1080P Video Quality\r\n- No Advertisement\r\n- Could be used on 4 devices on the same time\r\n- Include all access to VIP movies\r\n- Support Video Download and Indonesia Subtitle\r\n\r\n# Terms of Service\r\n- Account is given from us\r\n- Do not change any account information unless it\'s needed to prevent account error', 'https://wikilaptop.com/wp-content/uploads/2020/09/1599267541_Huong-dan-cai-dat-va-xem-phim-voi-iQIYI-tren.jpg?v=1599267541', 'No Label', 'iqiyi'),
(18, 7, 1, 'Youtube Premium', '# Features\r\n- No Advertisement\r\n- Include all access to Youtube Originals\r\n- Support Video Download\r\n\r\n# Terms of Service\r\n- Account is from you\r\n- Accounts that can be used are accounts that:\r\n    1. Never used a premium package\r\n    2. Have not changed family 2 times within 1 year\r\n- You\'ll be given a family invitation link to activated premium package', 'https://www.youredm.com/wp-content/uploads/2018/12/youtube-logo.png', 'No Label', NULL),
(19, 7, 1, 'Iflix', '# Features\r\n- Stream Video Without Advertisement\r\n- High Resolution Video\r\n- Support Offline Video Download\r\n\r\n# Terms of Service\r\n- Account is from us\r\n- Do not change anything on the account settings', 'https://static.republika.co.id/uploads/images/detailnews/foto-ilustrasi_200802110745-653.jpg', 'No Label', NULL),
(20, 7, 1, 'Viu', '# Features\r\n- Indonesia Region\r\n- Stream Video Without Advertisement\r\n- High Resolution Video\r\n- Support Offline Video Download\r\n\r\n# Terms of Service\r\n- Account is from us\r\n- Do not change anything on the account settings', 'https://www.wowkeren.com/display/images/photo/2019/09/27/00275387_1.jpg', 'Instant', NULL),
(21, 7, 1, 'HBO GO', '# Features\r\n- **ONLY FOR 1 DEVICE**\r\n- Stream Video Without Advertisement\r\n- High Resolution Video\r\n- Support Offline Video Download\r\n\r\n# Terms of Service\r\n- Account is from us\r\n- Do not change anything on the account settings', 'https://www.vpnanswers.com/wp-content/uploads/2017/05/hbo_go_featured.jpg', 'No Label', NULL),
(22, 7, 1, 'Vidio', '\'NULL\'', 'https://img2.apksum.com/39/com.vidio.android.tv/1.39.1/icon.png', 'Instant', '# Features\r\n- Stream Video Without Advertisement\r\n- High Resolution Video\r\n- Support Offline Video Download\r\n\r\n# Terms of Service\r\n- Account is from us\r\n- Do not change anything on the account settings'),
(23, 7, 1, 'Spotify', '# Features\r\n- High Quality Streaming\r\n- No Advertisement\r\n- Include Song Downloader & Offline Mode Feature\r\n- Can Shuffle Track Without Limit\r\n\r\n# Terms of Service\r\n**Personal**\r\n- You\'ll be given a family invite link to join to our account\r\n\r\n**Admin**\r\n- You\'ll be given the account\r\n- Only 1 time account exchange guarantee is available', 'https://gadgetren.com/wp-content/uploads/2020/02/Spotify-Logo.jpg', 'No Label', 'spotify, spotify family,spotify indonesia,spotify id');

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
-- Table structure for table `product_stocks`
--

CREATE TABLE `product_stocks` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_variant_id` int(11) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `setup_price` int(11) NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `usage_duration` int(11) NOT NULL DEFAULT 30,
  `warranty_duration` int(11) NOT NULL DEFAULT 30,
  `extendable` tinyint(1) NOT NULL DEFAULT 0,
  `stackable` tinyint(1) NOT NULL DEFAULT 0,
  `maximum_purchase` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `name`, `price`, `setup_price`, `stock`, `usage_duration`, `warranty_duration`, `extendable`, `stackable`, `maximum_purchase`) VALUES
(1, 1, 'Small', 100300, 90000, 999, 30, 30, 1, 0, 1),
(2, 1, 'Medium', 168400, 90000, 999, 30, 30, 1, 0, 1),
(3, 1, 'Large', 270000, 90000, 999, 30, 30, 1, 0, 1),
(4, 1, 'Xtra Large', 476000, 90000, 999, 30, 30, 1, 0, 1),
(5, 2, 'Personal', 88300, 0, 10, 30, 30, 0, 0, 1),
(6, 2, 'Professional', 110000, 0, 10, 30, 30, 0, 0, 1),
(7, 2, 'Bussiness', 210600, 0, 10, 30, 30, 0, 0, 1),
(8, 14, 'Private Account', 92100, 0, 10, 30, 30, 0, 0, 2),
(9, 14, 'Shared Account', 32000, 0, 10, 30, 30, 0, 0, 2),
(10, 15, 'Family Personal', 9500, 0, 10, 30, 30, 0, 0, 2),
(11, 15, 'Family Admin (25 Days)', 17800, 0, 10, 25, 25, 0, 0, 2),
(12, 16, 'Shared Account', 22300, 0, 10, 30, 30, 0, 0, 2),
(13, 16, 'Private Account', 31500, 0, 10, 30, 30, 0, 0, 2),
(14, 17, 'Private Account', 8800, 0, 10, 30, 30, 0, 0, 2),
(15, 18, '1 Month', 6500, 0, 10, 30, 30, 0, 0, 2),
(16, 19, 'Shared Account', 4300, 0, 10, 30, 30, 0, 0, 2),
(17, 20, '1 Month', 6100, 0, 10, 30, 30, 0, 0, 2),
(18, 21, 'Shared Account', 32100, 0, 10, 30, 30, 0, 0, 2),
(19, 22, '1 Month', 16200, 0, 10, 30, 30, 0, 0, 2),
(20, 3, '$1', 14850, 0, 40, 1, 1, 0, 1, 0),
(21, 3, '$51', 14740, 0, 40, 1, 1, 0, 1, 0),
(22, 3, '$101', 14630, 0, 40, 1, 1, 0, 1, 0),
(23, 4, 'RP 50.000', 51500, 0, 10, 1, 1, 0, 1, 2),
(24, 4, 'RP 10.000', 11100, 0, 10, 1, 1, 0, 1, 2),
(25, 5, 'RP 10.000', 12100, 0, 10, 1, 30, 0, 1, 2),
(26, 5, 'RP 50.000', 52500, 0, 10, 1, 1, 0, 1, 2),
(27, 6, 'RP 10.000', 12100, 0, 10, 1, 30, 0, 1, 2),
(28, 6, 'RP 50.000', 52500, 0, 10, 1, 1, 0, 1, 2),
(29, 7, 'IDR 45.000', 51200, 0, 100, 1, 1, 0, 1, 0),
(30, 7, 'IDR 12.000', 14400, 0, 100, 1, 1, 0, 1, 0),
(31, 7, 'IDR 60.000', 66300, 0, 100, 1, 1, 0, 1, 0),
(32, 7, 'IDR 90.000', 101500, 0, 100, 1, 1, 0, 1, 0),
(33, 7, 'IDR 120.000', 139000, 0, 100, 1, 1, 0, 1, 0),
(34, 8, 'IDR 5.000', 5400, 0, 100, 1, 1, 0, 1, 0),
(35, 8, 'IDR 10.000', 10400, 0, 100, 1, 1, 0, 1, 0),
(36, 8, 'IDR 20.000', 20110, 0, 100, 1, 1, 0, 1, 0),
(37, 8, 'IDR 50.000', 50500, 0, 100, 1, 1, 0, 1, 0),
(38, 9, '100 UC', 22600, 0, 100, 1, 1, 0, 1, 0),
(39, 9, '210 UC', 46000, 0, 100, 1, 1, 0, 1, 0),
(40, 9, '250 UC', 53400, 0, 100, 1, 1, 0, 1, 0),
(41, 9, '600 UC', 126000, 0, 100, 1, 1, 0, 1, 0),
(42, 9, '600 UC', 126000, 0, 100, 1, 1, 0, 1, 0),
(43, 9, '800 UC', 169000, 0, 100, 1, 1, 0, 1, 0),
(44, 9, '1000 UC', 211000, 0, 100, 1, 1, 0, 1, 0),
(45, 9, '2000 UC', 368400, 0, 100, 1, 1, 0, 1, 0),
(46, 10, '70 Diamonds', 11300, 0, 100, 1, 1, 0, 1, 0),
(47, 10, '140 Diamonds', 21500, 0, 100, 1, 1, 0, 1, 0),
(48, 10, '210 Diamonds', 31800, 0, 100, 1, 1, 0, 1, 0),
(49, 10, '355 Diamonds', 52000, 0, 100, 1, 1, 0, 1, 0),
(50, 10, '510 Diamonds', 75000, 0, 100, 1, 1, 0, 1, 0),
(51, 10, '720 Diamonds', 101000, 0, 100, 1, 1, 0, 1, 0),
(52, 10, '1200 Diamonds', 168700, 0, 100, 1, 1, 0, 1, 0),
(53, 10, '2000 Diamonds', 270200, 0, 100, 1, 1, 0, 1, 0),
(54, 11, 'Full Access', 482000, 0, 30, 365, 30, 0, 0, 3),
(55, 11, 'Semi-Full Access', 16000, 0, 0, 365, 3, 0, 0, 5),
(56, 12, 'Unlimited Storage', 24000, 0, 200, 30, 30, 0, 0, 2),
(57, 13, 'Pro 1 Month', 2150, 0, 200, 30, 30, 0, 0, 2);

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) NOT NULL DEFAULT '/assets/img/logo-full.png',
  `banner` varchar(255) NOT NULL DEFAULT '/assets/img/banner.png',
  `address` longtext DEFAULT NULL,
  `status` set('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`id`, `name`, `logo`, `banner`, `address`, `status`) VALUES
(1, 'Foxxy', '/assets/img/logo-full.png', '/assets/img/banner.png', 'Jl. Inpres Raya, Tangerang, Banten, 15154', 'OPEN'),
(2, 'Contabo', '/assets/img/stores/Contabo.png', '/assets/img/stores/Contabo.png', 'Aschauer Straße 32a, 81549 Munich, Germany', 'OPEN'),
(3, 'Linode', '/assets/img/stores/Linode.png', '/assets/img/stores/Linode.png', 'Philadelphia, Pennsylvania, United States', 'OPEN');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `transaction_id` varchar(191) NOT NULL,
  `transaction_additional_information` longtext DEFAULT NULL,
  `product_id` int(15) NOT NULL,
  `product_variant_id` int(11) NOT NULL,
  `product_amount` int(11) DEFAULT NULL,
  `product_price` int(11) NOT NULL,
  `product_description` longtext DEFAULT '# Please Contact Us to Claim Your Purchase!',
  `payment_method` varchar(191) NOT NULL,
  `payment_gateway` varchar(255) NOT NULL,
  `payment_status` set('UNPAID','PAID','REFUND','EXPIRED','FAILED') NOT NULL DEFAULT 'UNPAID',
  `product_status` set('PENDING','ACTIVE','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `date_purchased` varchar(255) DEFAULT NULL,
  `date_product_expired` varchar(255) DEFAULT NULL,
  `date_warranty_expired` varchar(255) NOT NULL
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
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_reviews_ibfk_1` (`transaction_id`),
  ADD KEY `product_reviews_ibfk_2` (`product_id`),
  ADD KEY `product_reviews_ibfk_3` (`member_id`);

--
-- Indexes for table `product_stocks`
--
ALTER TABLE `product_stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_stocks_ibfk_1` (`product_id`),
  ADD KEY `product_stocks_ibfk_2` (`product_variant_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_variants_ibfk_1` (`product_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `transactions_ibfk_2` (`product_id`),
  ADD KEY `transactions_ibfk_3` (`store_id`),
  ADD KEY `product_variant_id` (`product_variant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banned_ip`
--
ALTER TABLE `banned_ip`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `email_subscriber`
--
ALTER TABLE `email_subscriber`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
-- AUTO_INCREMENT for table `product_stocks`
--
ALTER TABLE `product_stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_3` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`);

--
-- Constraints for table `product_list`
--
ALTER TABLE `product_list`
  ADD CONSTRAINT `product_list_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `product_list_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`);

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_3` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_stocks`
--
ALTER TABLE `product_stocks`
  ADD CONSTRAINT `product_stocks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `product_stocks_ibfk_2` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
