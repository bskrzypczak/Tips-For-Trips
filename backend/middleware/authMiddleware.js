const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Brak tokenu autoryzacji' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Nieprawidłowy token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Nieprawidłowy token' });
    }
};

module.exports = authMiddleware;
