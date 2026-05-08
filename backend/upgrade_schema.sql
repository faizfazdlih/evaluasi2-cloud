USE sistem_pelayanan_publik;

-- Tambahkan kolom untuk dukungan pengajuan surat, pengaduan, dan upload file
ALTER TABLE applications
  ADD COLUMN application_type ENUM('surat', 'pengaduan') DEFAULT 'surat' AFTER user_id,
  ADD COLUMN title VARCHAR(200) NOT NULL AFTER service_id,
  ADD COLUMN contact_number VARCHAR(30) NULL AFTER description,
  ADD COLUMN attachment_path VARCHAR(255) NULL AFTER contact_number,
  ADD COLUMN attachment_name VARCHAR(255) NULL AFTER attachment_path,
  ADD COLUMN attachment_type VARCHAR(100) NULL AFTER attachment_name;

-- Ubah service_id agar bisa null untuk pengaduan
ALTER TABLE applications
  MODIFY COLUMN service_id INT NULL;

-- Ubah foreign key agar service_id boleh null saat pengaduan
ALTER TABLE applications
  DROP FOREIGN KEY applications_ibfk_2;

ALTER TABLE applications
  ADD CONSTRAINT applications_ibfk_2
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL;

-- Tambahkan index baru
ALTER TABLE applications
  ADD INDEX idx_application_type (application_type);
