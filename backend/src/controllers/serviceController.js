const Service = require('../models/Service');

const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await Service.findByCategory(category);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, category, status } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    await Service.create({ name, description, category, status });
    res.status(201).json({ message: 'Layanan berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, status } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }

    await Service.update(id, { name, description, category, status });
    res.json({ message: 'Layanan berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }

    await Service.delete(id);
    res.json({ message: 'Layanan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  createService,
  updateService,
  deleteService
};
