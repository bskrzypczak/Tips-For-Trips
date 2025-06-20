const express = require('express');
const router = express.Router();
const { 
    getCommentsByActivity, 
    addComment, 
    deleteComment, 
    getActivityDetails 
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Pobierz szczegóły atrakcji z komentarzami (publiczne)
router.get('/activity/:id_atrakcji', getActivityDetails);

// Pobierz komentarze dla atrakcji (publiczne)
router.get('/activity/:id_atrakcji/comments', getCommentsByActivity);

// Dodaj komentarz (wymagane logowanie)
router.post('/activity/:id_atrakcji/comments', authMiddleware, addComment);

// Usuń komentarz (wymagane logowanie + uprawnienia)
router.delete('/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
