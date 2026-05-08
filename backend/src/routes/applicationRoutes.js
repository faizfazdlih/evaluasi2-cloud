const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  getMyApplications,
  createApplication,
  updateApplication,
  deleteApplication
} = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', authenticateToken, authorizeRoles('admin', 'staff'), getAllApplications);
router.get('/my-applications', authenticateToken, getMyApplications);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'staff'), getApplicationById);
router.post('/', authenticateToken, upload.single('attachment'), createApplication);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'staff'), updateApplication);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'staff'), deleteApplication);

module.exports = router;
