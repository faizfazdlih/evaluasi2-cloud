-- Create Database
CREATE DATABASE IF NOT EXISTS sistem_pelayanan_publik;
USE sistem_pelayanan_publik;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('citizen', 'admin', 'staff') DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Create Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status)
);

-- Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  application_type ENUM('surat', 'pengaduan') DEFAULT 'surat',
  service_id INT NULL,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT,
  contact_number VARCHAR(30),
  attachment_path VARCHAR(255),
  attachment_name VARCHAR(255),
  attachment_type VARCHAR(100),
  status ENUM('pending', 'in_process', 'completed', 'rejected') DEFAULT 'pending',
  notes LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_service_id (service_id),
  INDEX idx_application_type (application_type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Insert sample services
INSERT INTO services (name, description, category, status) VALUES
('Surat Keterangan Penduduk', 'Layanan pembuatan surat keterangan penduduk untuk keperluan administrasi', 'Kependudukan', 'active'),
('Surat Pengantar', 'Layanan pembuatan surat pengantar untuk berbagai keperluan', 'Administrasi', 'active'),
('Izin Usaha', 'Layanan pengurusan izin usaha untuk wiraswasta', 'Bisnis', 'active'),
('Surat Keterangan Tidak Mampu', 'Layanan pembuatan surat keterangan tidak mampu untuk beasiswa', 'Sosial', 'active'),
('Akta Kematian', 'Layanan pendaftaran akta kematian', 'Pencatatan Sipil', 'active'),
('Akta Kelahiran', 'Layanan pendaftaran akta kelahiran', 'Pencatatan Sipil', 'active'),
('Izin Oranis', 'Layanan pengurusan izin organisasi masyarakat', 'Organisasi', 'active'),
('Bantuan Sosial', 'Layanan informasi dan pengajuan bantuan sosial', 'Sosial', 'active');
