DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
    `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`category_id`),
    KEY `status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
    `orders_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `user_id` bigint(20) NOT NULL,
    `origin_price` int(11) NOT NULL,
    `price` int(11) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`orders_id`),
    KEY `user_id` (`user_id`),
    KEY `status` (`status`) USING BTREE,
    KEY `created_at` (`created_at`) USING BTREE,
    CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `orders_detail`;
CREATE TABLE `orders_detail` (
    `orders_detail_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `orders_id` bigint(20) NOT NULL,
    `product_id` bigint(20) NOT NULL,
    `origin_price` int(11) NOT NULL,
    `price` int(11) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`orders_detail_id`),
    KEY `product_id` (`product_id`),
    KEY `orders_id_and_producdt_id` (`orders_id`,`product_id`) USING BTREE,
    KEY `status` (`status`) USING BTREE,
    CONSTRAINT `orders_detail_ibfk_1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`orders_id`),
    CONSTRAINT `orders_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
    `payment_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `user_id` bigint(20) NOT NULL,
    `orders_id` bigint(20) NOT NULL,
    `price` int(11) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`payment_id`),
    KEY `user_id` (`user_id`),
    KEY `orders_id` (`orders_id`),
    KEY `status` (`status`) USING BTREE,
    CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`orders_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
    `product_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `category_id` bigint(20) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`product_id`),
    KEY `category_id` (`category_id`),
    KEY `status` (`status`) USING BTREE,
    CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_detail`;
CREATE TABLE `product_detail` (
    `product_detail_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `product_id` bigint(20) NOT NULL,
    `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt1` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt3` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt4` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt5` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt6` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt7` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `opt8` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `origin_price` int(11) NOT NULL DEFAULT 0,
    `price` int(11) NOT NULL DEFAULT 0,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`product_detail_id`),
    KEY `product_id` (`product_id`),
    KEY `status` (`status`) USING BTREE,
    CONSTRAINT `product_detail_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
    `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'NORMAL',
    `name` varchar(100) NOT NULL,
    `age` int(3) NOT NULL,
    `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp(),
    `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`user_id`),
    KEY `status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;