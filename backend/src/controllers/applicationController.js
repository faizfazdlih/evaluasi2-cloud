const Application = require('../models/Application');
const path = require('path');

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Permohonan tidak ditemukan' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findByUserId(req.user.id);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const createApplication = async (req, res) => {
  try {
    const {
      application_type,
      service_id,
      title,
      description,
      contact_number
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Judul permohonan wajib diisi' });
    }

    const normalizedType = application_type || 'surat';
    if (normalizedType === 'surat' && !service_id) {
      return res.status(400).json({ message: 'Layanan harus dipilih untuk pengajuan surat' });
    }

    const file = req.file;
    const attachmentPath = file ? path.posix.join('uploads', file.filename) : null;

    const created = await Application.create({
      user_id: req.user.id,
      application_type: normalizedType,
      service_id: service_id || null,
      title,
      description,
      contact_number,
      attachment_path: attachmentPath,
      attachment_name: file ? file.originalname : null,
      attachment_type: file ? file.mimetype : null,
      status: 'pending'
    });

    res.status(201).json({
      message: normalizedType === 'pengaduan' ? 'Pengaduan berhasil dikirim' : 'Permohonan berhasil dibuat',
      id: created.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Permohonan tidak ditemukan' });
    }

    await Application.update(id, { status, notes });
    res.json({ message: 'Permohonan berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Permohonan tidak ditemukan' });
    }

    await Application.delete(id);
    res.json({ message: 'Permohonan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  getMyApplications,
  createApplication,
  updateApplication,
  deleteApplication
};
