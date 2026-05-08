const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', getAllServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);
router.post('/', authenticateToken, authorizeRoles('admin', 'staff'), createService);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'staff'), updateService);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'staff'), deleteService);

module.exports = router;
