-- OkiruDrink Database Schema
-- Run this file once to initialize the database

CREATE DATABASE IF NOT EXISTS okirudrink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE okirudrink;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL UNIQUE,
  phone       VARCHAR(20)   NULL,
  password    VARCHAR(255)  NOT NULL,
  avatar      VARCHAR(255)  NULL,
  points      INT           NOT NULL DEFAULT 0,
  stamps      INT           NOT NULL DEFAULT 0,
  level       ENUM('Basic', 'Silver', 'Gold', 'Diamond') NOT NULL DEFAULT 'Basic',
  level_expiry_year INT     NULL COMMENT 'Year the current level expires if points not maintained',
  join_date   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Outlets ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS outlets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  address     TEXT          NOT NULL,
  city        VARCHAR(100)  NOT NULL DEFAULT 'Muara Enim',
  phone       VARCHAR(20)   NULL,
  lat         DECIMAL(10, 8) NULL,
  lng         DECIMAL(11, 8) NULL,
  is_active   TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Products ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  description TEXT          NULL,
  price       INT           NOT NULL,
  image       VARCHAR(255)  NULL,
  category    VARCHAR(50)   NULL,
  is_available TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Orders ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT           NOT NULL,
  outlet_id      INT           NULL,
  status         ENUM('pending','processing','ready','delivered','cancelled') NOT NULL DEFAULT 'pending',
  delivery_mode  ENUM('pickup','delivery') NOT NULL DEFAULT 'pickup',
  total_price    INT           NOT NULL,
  discount       INT           NOT NULL DEFAULT 0,
  final_price    INT           NOT NULL,
  points_earned  INT           NOT NULL DEFAULT 0,
  voucher_id     INT           NULL,
  notes          TEXT          NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Order Items ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  order_id    INT           NOT NULL,
  product_id  INT           NOT NULL,
  qty         INT           NOT NULL DEFAULT 1,
  price       INT           NOT NULL,
  sweet_level VARCHAR(50)   NULL,
  ice_level   VARCHAR(50)   NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- ── Vouchers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vouchers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(50)   NOT NULL UNIQUE,
  title         VARCHAR(100)  NOT NULL,
  description   TEXT          NULL,
  terms         TEXT          NULL COMMENT 'Syarat dan Ketentuan',
  discount_type ENUM('percent','fixed') NOT NULL DEFAULT 'percent',
  discount_value INT          NOT NULL,
  min_purchase  INT           NOT NULL DEFAULT 0,
  max_usage     INT           NULL COMMENT 'NULL = unlimited',
  used_count    INT           NOT NULL DEFAULT 0,
  level_required ENUM('Basic','Silver','Gold','Diamond') NULL COMMENT 'NULL = all levels',
  expires_at    DATE          NULL,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── User Vouchers ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_vouchers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT           NOT NULL,
  voucher_id  INT           NOT NULL,
  is_used     TINYINT(1)    NOT NULL DEFAULT 0,
  used_at     DATETIME      NULL,
  assigned_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_voucher (user_id, voucher_id)
);

-- ── Addresses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT           NOT NULL,
  label       VARCHAR(50)   NOT NULL DEFAULT 'Rumah',
  recipient   VARCHAR(100)  NOT NULL,
  phone       VARCHAR(20)   NOT NULL,
  address     TEXT          NOT NULL,
  city        VARCHAR(100)  NOT NULL,
  is_default  TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── Seed: Outlets ─────────────────────────────────────────────
INSERT IGNORE INTO outlets (name, address, city, phone, lat, lng) VALUES
('OkiruDrink Muara Enim Pusat',  'Jl. Jenderal Sudirman No. 12, Muara Enim', 'Muara Enim', '0812-0000-0001', -3.6655, 103.7550),
('OkiruDrink Pasar Lama',        'Jl. Pasar Lama No. 5, Muara Enim',          'Muara Enim', '0812-0000-0002', -3.6700, 103.7600),
('OkiruDrink Tanjung Enim',      'Jl. Raya Tanjung Enim No. 88',              'Tanjung Enim', '0812-0000-0003', -3.7271, 103.8916);

-- ── Seed: Vouchers ────────────────────────────────────────────
INSERT IGNORE INTO vouchers (code, title, description, terms, discount_type, discount_value, min_purchase, level_required, expires_at) VALUES
('OKIRU2026',  'Diskon 10% Spesial',     'Hemat 10% untuk semua pesanan', 'Berlaku 1x penggunaan per akun. Tidak dapat digabungkan dengan promo lain. Minimum pembelian Rp 25.000.', 'percent', 10, 25000, NULL,     '2026-12-31'),
('SILVERFREE', 'Gratis 1 Minuman',       'Gratis 1 botol OkiruDrink Original', 'Khusus member Silver ke atas. Berlaku untuk produk Original 200ml saja. Tidak berlaku saat promo lain aktif.', 'fixed', 15000, 0, 'Silver', '2026-12-31'),
('GOLD20',     'Diskon 20% Member Gold', 'Diskon eksklusif untuk Member Gold', 'Khusus member Gold ke atas. Berlaku untuk semua produk. Minimum pembelian Rp 50.000.', 'percent', 20, 50000, 'Gold',   '2026-12-31');
