const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Wszystkie trasy wymagają uprawnień administratora
router.use(adminMiddleware);

// Statystyki administratora
router.get('/stats', adminController.getAdminStats);

// Zarządzanie użytkownikami
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.delete('/users/:userId', adminController.deleteUser);
router.patch('/users/:userId/role', adminController.updateUserRole);

// Zarządzanie atrakcjami
router.get('/activities', adminController.getAllActivities);
router.post('/activities', adminController.createActivity);
router.put('/activities/:activityId', adminController.updateActivity);
router.delete('/activities/:activityId', adminController.deleteActivity);

module.exports = router;
