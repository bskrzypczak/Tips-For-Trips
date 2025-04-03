const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    id_atrakcji: {
        type: Number,
        required: true,
        unique: true,
    },
    nazwa_atrakcji: {
        type: String,
        required: true,
    },
    id_miasta: {
        type: Number,
        required: true,
    },
    aktywnosc: {
        type: Number,
        required: true,
        min:[0, 'Ocena musi wynosic co najmniej 0'],
        max:[10, 'Ocena moze wynosic co najwyzej 10'],
    },
    centrum: {
        type: Number,
        required: true,
        min:[0, 'Ocena musi wynosic co najmniej 0'],
        max:[10, 'Ocena moze wynosic co najwyzej 10'],
    },
    zatloczenie: {
        type: Number,
        required: true,
        min:[0, 'Ocena musi wynosic co najmniej 0'],
        max:[10, 'Ocena moze wynosic co najwyzej 10'],
    },
    dostepnosc_pamiatek: {
        type: Number,
        required: true,
        min:[0, 'Ocena musi wynosic co najmniej 0'],
        max:[10, 'Ocena moze wynosic co najwyzej 10'],
    },
    adrenalina: {
        type: Number,
        required: true,
        min:[0, 'Ocena musi wynosic co najmniej 0'],
        max:[10, 'Ocena moze wynosic co najwyzej 10'],
    },
    cena: {
        type: Number,
        required: true,
        min:[0, 'Cena musi wynosic co najmniej 0'],
    },
    godziny_otwarcia: {
        dni_robiocze: {
            type: String,
            required: true,
        },
        weekend: {
            type: String,
            required: true,
        },
    },
    lokalizacja: {
        szerokosc: {
            type: Number,
            required: true,
        },
        dlugosc: {
            type: Number,
            required: true,
        },
    },
    opis: {
        type: String,
        required: true,
    },
    sezon: {
        type: String,
        required: true,
    },
    ocena: {
        type: Number,
        required: true,
        min:[0, 'Ocena musi wynosic co najmniej 0'],
        max:[10, 'Ocena moze wynosic co najwyzej 10'],
    },
    czas_trwania: {
        type: Number,
        required: true,
        min:[0, 'Czas trwania musi wynosic co najmniej 0'],
    },
    tagi: {
        type: [String],  // Tablica stringów
        required: true,
    },
    uslugi: {
        type: [String],  // Tablica stringów
        required: true,
    },
}, {collection: 'Activities'});

// Tworzymy model dla atrakcji
const activity = mongoose.model('activity', activitySchema);

module.exports = activity;
