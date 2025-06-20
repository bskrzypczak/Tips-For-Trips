const Comment = require('../models/commentModel');
const Activity = require('../models/activityModel');

// Pobierz komentarze dla atrakcji
const getCommentsByActivity = async (req, res) => {
    try {
        const { id_atrakcji } = req.params;
        
        const comments = await Comment.find({ id_atrakcji: parseInt(id_atrakcji) })
            .sort({ data_utworzenia: -1 });
        
        res.json({
            success: true,
            comments
        });
    } catch (error) {
        console.error('Błąd pobierania komentarzy:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd serwera podczas pobierania komentarzy'
        });
    }
};

// Dodaj komentarz (tylko dla zalogowanych użytkowników)
const addComment = async (req, res) => {
    try {
        const { id_atrakcji } = req.params;
        const { komentarz, ocena } = req.body;
        const user_id = req.user.id;
        const username = req.user.username;

        // Sprawdź czy atrakcja istnieje
        const activity = await Activity.findOne({ id_atrakcji: parseInt(id_atrakcji) });
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Atrakcja nie została znaleziona'
            });
        }

        // Sprawdź czy użytkownik już skomentował tę atrakcję
        const existingComment = await Comment.findOne({ 
            id_atrakcji: parseInt(id_atrakcji), 
            user_id 
        });
        
        if (existingComment) {
            return res.status(400).json({
                success: false,
                message: 'Już dodałeś komentarz do tej atrakcji'
            });
        }

        const newComment = new Comment({
            id_atrakcji: parseInt(id_atrakcji),
            user_id,
            username,
            komentarz,
            ocena
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: 'Komentarz został dodany',
            comment: newComment
        });
    } catch (error) {
        console.error('Błąd dodawania komentarza:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd serwera podczas dodawania komentarza'
        });
    }
};

// Usuń komentarz (tylko autor lub admin)
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const user_id = req.user.id;
        const userRole = req.user.role;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Komentarz nie został znaleziony'
            });
        }

        // Sprawdź czy użytkownik może usunąć komentarz (autor lub admin)
        if (comment.user_id.toString() !== user_id && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Nie masz uprawnień do usunięcia tego komentarza'
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.json({
            success: true,
            message: 'Komentarz został usunięty'
        });
    } catch (error) {
        console.error('Błąd usuwania komentarza:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd serwera podczas usuwania komentarza'
        });
    }
};

// Pobierz szczegóły atrakcji z komentarzami
const getActivityDetails = async (req, res) => {
    try {
        const { id_atrakcji } = req.params;
        
        const activity = await Activity.findOne({ id_atrakcji: parseInt(id_atrakcji) });
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Atrakcja nie została znaleziona'
            });
        }

        const comments = await Comment.find({ id_atrakcji: parseInt(id_atrakcji) })
            .sort({ data_utworzenia: -1 });

        // Oblicz średnią ocenę z komentarzy
        const averageRating = comments.length > 0 
            ? comments.reduce((sum, comment) => sum + comment.ocena, 0) / comments.length
            : activity.ocena;

        res.json({
            success: true,
            activity,
            comments,
            averageRating: Math.round(averageRating * 10) / 10,
            commentCount: comments.length
        });
    } catch (error) {
        console.error('Błąd pobierania szczegółów atrakcji:', error);
        res.status(500).json({
            success: false,
            message: 'Błąd serwera podczas pobierania szczegółów atrakcji'
        });
    }
};

module.exports = {
    getCommentsByActivity,
    addComment,
    deleteComment,
    getActivityDetails
};
