const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Walidatory
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Podaj prawidłowy adres email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Hasło musi mieć co najmniej 6 znaków'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('Imię jest wymagane'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Nazwisko jest wymagane')
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Podaj prawidłowy adres email'),
    body('password')
        .notEmpty()
        .withMessage('Hasło jest wymagane')
];

const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Imię nie może być puste'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Nazwisko nie może być puste')
];

// Publiczne trasy
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Chronione trasy
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, authController.updateProfile);

module.exports = router;
