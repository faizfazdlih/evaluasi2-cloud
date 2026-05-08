const pool = require('../config/database');

class Application {
  static async create(appData) {
    const {
      user_id,
      application_type,
      service_id,
      title,
      description,
      contact_number,
      attachment_path,
      attachment_name,
      attachment_type,
      status
    } = appData;

    const [result] = await pool.query(
      `INSERT INTO applications 
        (user_id, application_type, service_id, title, description, contact_number, attachment_path, attachment_name, attachment_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        application_type || 'surat',
        service_id || null,
        title,
        description,
        contact_number || null,
        attachment_path || null,
        attachment_name || null,
        attachment_type || null,
        status || 'pending'
      ]
    );

    return result;
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT a.*, s.name as service_name, u.username 
       FROM applications a 
       LEFT JOIN services s ON a.service_id = s.id 
       JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT a.*, s.name as service_name, u.username 
       FROM applications a 
       LEFT JOIN services s ON a.service_id = s.id 
       JOIN users u ON a.user_id = u.id 
       WHERE a.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT a.*, s.name as service_name 
       FROM applications a 
       LEFT JOIN services s ON a.service_id = s.id 
       WHERE a.user_id = ? 
       ORDER BY a.created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async update(id, appData) {
    const { status, notes } = appData;
    await pool.query(
      'UPDATE applications SET status = ?, notes = ? WHERE id = ?',
      [status, notes, id]
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM applications WHERE id = ?', [id]);
  }
}

module.exports = Application;
