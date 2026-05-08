const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const ensureApplicationsSchema = async () => {
  const dbName = process.env.DB_NAME;
  const [columns] = await pool.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'applications'`,
    [dbName]
  );

  const existingColumns = new Set(columns.map((row) => row.COLUMN_NAME));
  const alterStatements = [];

  if (!existingColumns.has('application_type')) {
    alterStatements.push(`ALTER TABLE applications ADD COLUMN application_type ENUM('surat', 'pengaduan') DEFAULT 'surat' AFTER user_id`);
  }

  if (!existingColumns.has('title')) {
    alterStatements.push(`ALTER TABLE applications ADD COLUMN title VARCHAR(200) NOT NULL AFTER service_id`);
  }

  if (!existingColumns.has('contact_number')) {
    alterStatements.push(`ALTER TABLE applications ADD COLUMN contact_number VARCHAR(30) NULL AFTER description`);
  }

  if (!existingColumns.has('attachment_path')) {
    alterStatements.push(`ALTER TABLE applications ADD COLUMN attachment_path VARCHAR(255) NULL AFTER contact_number`);
  }

  if (!existingColumns.has('attachment_name')) {
    alterStatements.push(`ALTER TABLE applications ADD COLUMN attachment_name VARCHAR(255) NULL AFTER attachment_path`);
  }

  if (!existingColumns.has('attachment_type')) {
    alterStatements.push(`ALTER TABLE applications ADD COLUMN attachment_type VARCHAR(100) NULL AFTER attachment_name`);
  }

  if (existingColumns.has('service_id')) {
    alterStatements.push(`ALTER TABLE applications MODIFY COLUMN service_id INT NULL`);
  }

  for (const statement of alterStatements) {
    await pool.query(statement);
  }

  const [indexes] = await pool.query(
    `SELECT INDEX_NAME
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'applications'`,
    [dbName]
  );

  const existingIndexes = new Set(indexes.map((row) => row.INDEX_NAME));
  if (!existingIndexes.has('idx_application_type')) {
    await pool.query('ALTER TABLE applications ADD INDEX idx_application_type (application_type)');
  }
};

const initializeDatabase = async () => {
  await ensureApplicationsSchema();

  const [roles] = await pool.query(
    `SELECT role FROM users WHERE role IN ('admin', 'staff') LIMIT 1`
  );

  if (roles.length === 0) {
    const adminPassword = await bcrypt.hash('password123', 10);
    const staffPassword = await bcrypt.hash('password123', 10);

    await pool.query(
      `INSERT INTO users (username, email, password, role)
       VALUES
       (?, ?, ?, ?),
       (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE email = email`,
      [
        'admin_desa',
        'admin@desa.id',
        adminPassword,
        'admin',
        'staff_desa',
        'staff@desa.id',
        staffPassword,
        'staff'
      ]
    );
  }
};

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
