const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id_atrakcji: {
        type: Number,
        required: true,
        ref: 'activity'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: {
        type: String,
        required: true
    },
    komentarz: {
        type: String,
        required: true,
        maxlength: [1000, 'Komentarz nie może być dłuższy niż 1000 znaków']
    },
    ocena: {
        type: Number,
        required: true,
        min: [1, 'Ocena musi wynosić co najmniej 1'],
        max: [5, 'Ocena może wynosić co najwyżej 5']
    },
    data_utworzenia: {
        type: Date,
        default: Date.now
    }
}, {collection: 'Comments'});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
