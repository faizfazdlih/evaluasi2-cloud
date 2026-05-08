const pool = require('../config/database');

class Service {
  static async create(serviceData) {
    const { name, description, category, status } = serviceData;

    const [result] = await pool.query(
      'INSERT INTO services (name, description, category, status) VALUES (?, ?, ?, ?)',
      [name, description, category, status || 'active']
    );

    return result;
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, serviceData) {
    const { name, description, category, status } = serviceData;
    await pool.query(
      'UPDATE services SET name = ?, description = ?, category = ?, status = ? WHERE id = ?',
      [name, description, category, status, id]
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
  }

  static async findByCategory(category) {
    const [rows] = await pool.query('SELECT * FROM services WHERE category = ? ORDER BY created_at DESC', [category]);
    return rows;
  }
}

module.exports = Service;
