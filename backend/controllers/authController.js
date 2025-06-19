const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// Generowanie JWT tokenu
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Rejestracja użytkownika
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Błędne dane', 
                errors: errors.array() 
            });
        }

        const { email, password, firstName, lastName } = req.body;

        // Sprawdź czy użytkownik już istnieje
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik z tym emailem już istnieje' });
        }

        // Utwórz nowego użytkownika
        const user = new User({
            email,
            password,
            firstName,
            lastName
        });

        await user.save();

        // Wygeneruj token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Użytkownik zarejestrowany pomyślnie',
            token,
            user: user.toPublicJSON()
        });

    } catch (error) {
        console.error('Błąd rejestracji:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Logowanie użytkownika
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Błędne dane', 
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Znajdź użytkownika
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Nieprawidłowe dane logowania' });
        }

        // Sprawdź hasło
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Nieprawidłowe dane logowania' });
        }

        // Zaktualizuj ostatnie logowanie
        user.lastLogin = new Date();
        await user.save();

        // Wygeneruj token
        const token = generateToken(user._id);

        res.json({
            message: 'Logowanie pomyślne',
            token,
            user: user.toPublicJSON()
        });

    } catch (error) {
        console.error('Błąd logowania:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Pobieranie profilu użytkownika
const getProfile = async (req, res) => {
    try {
        res.json({
            user: req.user.toPublicJSON()
        });
    } catch (error) {
        console.error('Błąd pobierania profilu:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Aktualizacja profilu użytkownika
const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Błędne dane', 
                errors: errors.array() 
            });
        }

        const { firstName, lastName } = req.body;
        const user = req.user;

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        await user.save();

        res.json({
            message: 'Profil zaktualizowany pomyślnie',
            user: user.toPublicJSON()
        });

    } catch (error) {
        console.error('Błąd aktualizacji profilu:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
