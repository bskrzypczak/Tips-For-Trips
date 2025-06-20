const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const adminMiddleware = async (req, res, next) => {
    try {
        // Sprawdź czy użytkownik jest zalogowany
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Brak tokenu dostępu' });
        }

        // Weryfikuj token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'twoj_sekretny_klucz');
        
        // Znajdź użytkownika
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'Użytkownik nie istnieje' });
        }

        // Sprawdź czy użytkownik ma rolę administratora
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Dostęp tylko dla administratorów' });
        }

        // Dodaj użytkownika do req dla dalszego użycia
        req.user = user;
        next();
    } catch (error) {
        console.error('Błąd middleware administratora:', error);
        res.status(401).json({ message: 'Nieprawidłowy token' });
    }
};

module.exports = adminMiddleware;
