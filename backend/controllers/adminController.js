const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const City = require('../models/cityModel');

// Zarządzanie użytkownikami
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }) // Nie zwracaj hasła
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            users: users,
            count: users.length
        });
    } catch (error) {
        console.error('Błąd pobierania użytkowników:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId, { password: 0 });
        
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Błąd pobierania użytkownika:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Nie pozwól administratorowi usunąć samego siebie
        if (userId === req.user._id.toString()) {
            return res.status(400).json({ message: 'Nie możesz usunąć samego siebie' });
        }
        
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        
        res.json({
            success: true,
            message: 'Użytkownik został usunięty'
        });
    } catch (error) {
        console.error('Błąd usuwania użytkownika:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Nieprawidłowa rola' });
        }
        
        const user = await User.findByIdAndUpdate(
            userId,
            { role: role },
            { new: true, select: '-password' }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        
        res.json({
            success: true,
            message: 'Rola użytkownika została zaktualizowana',
            user: user
        });
    } catch (error) {
        console.error('Błąd aktualizacji roli:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Zarządzanie atrakcjami
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}).sort({ id_atrakcji: 1 });
        
        res.json({
            success: true,
            activities: activities,
            count: activities.length
        });
    } catch (error) {
        console.error('Błąd pobierania atrakcji:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

const createActivity = async (req, res) => {
    try {
        // Znajdź najwyższe id_atrakcji i dodaj 1
        const lastActivity = await Activity.findOne().sort({ id_atrakcji: -1 });
        const nextId = lastActivity ? lastActivity.id_atrakcji + 1 : 1;
        
        const activityData = {
            ...req.body,
            id_atrakcji: nextId
        };
        
        const activity = new Activity(activityData);
        await activity.save();
        
        res.status(201).json({
            success: true,
            message: 'Atrakcja została utworzona',
            activity: activity
        });
    } catch (error) {
        console.error('Błąd tworzenia atrakcji:', error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

const updateActivity = async (req, res) => {
    try {
        const { activityId } = req.params;
        
        const activity = await Activity.findOneAndUpdate(
            { id_atrakcji: activityId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!activity) {
            return res.status(404).json({ message: 'Atrakcja nie znaleziona' });
        }
        
        res.json({
            success: true,
            message: 'Atrakcja została zaktualizowana',
            activity: activity
        });
    } catch (error) {
        console.error('Błąd aktualizacji atrakcji:', error);
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const { activityId } = req.params;
        
        const activity = await Activity.findOneAndDelete({ id_atrakcji: activityId });
        
        if (!activity) {
            return res.status(404).json({ message: 'Atrakcja nie znaleziona' });
        }
        
        res.json({
            success: true,
            message: 'Atrakcja została usunięta'
        });
    } catch (error) {
        console.error('Błąd usuwania atrakcji:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Statystyki
const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const activityCount = await Activity.countDocuments();
        const cityCount = await City.countDocuments();
        
        // Ostatni zarejestrowani użytkownicy
        const recentUsers = await User.find({}, { password: 0 })
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.json({
            success: true,
            stats: {
                users: {
                    total: userCount,
                    admins: adminCount,
                    regular: userCount - adminCount
                },
                activities: activityCount,
                cities: cityCount,
                recentUsers: recentUsers
            }
        });
    } catch (error) {
        console.error('Błąd pobierania statystyk:', error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

module.exports = {
    // Użytkownicy
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserRole,
    // Atrakcje
    getAllActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    // Statystyki
    getAdminStats
};
