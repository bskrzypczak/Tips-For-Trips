const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    // Pytania z wyborem
    childrenPreferences: {
      type: String,
      required: true,
      enum: [
        "Yes",
        "Maybe",
        "No"
      ]
    },
    artInterest: {
      type: String,
      required: true,
      enum: [
        "Yes",
        "Maybe",
        "No"
      ]
    },
    historicalInterest: {
      type: String,
      required: true,
      enum: [
        "Yes",
        "Maybe",
        "No"
      ]
    },
    attractionDuration: {
      type: String,
      required: true,
      enum: [
        "Short",
        "Medium",
        "Long"
      ]
    },
    // Pytania z suwakiem
    activityLevel: {
      type: Number, // np. 1 - mniej aktywne, 10 - bardzo aktywne
      required: true,
      min: 1,
      max: 10
    },
    locationType: {
      type: Number, // np. 1 - centrum, 10 - przyroda
      required: true,
      min: 1,
      max: 10
    },
    crowdPreference: {
      type: Number, // np. 1 - spokojne, 10 - zatłoczone
      required: true,
      min: 1,
      max: 10
    },
    visitTime: {
      type: Number, // np. 1 - za dnia, 10 - w nocy
      required: true,
      min: 1,
      max: 10
    },
    adrenalinePreference: {
      type: Number, // np. 1 - preferuję spokojniejsze atrakcje, 10 - ekstremalne
      required: true,
      min: 1,
      max: 10
    },
    // Preferencje dotyczące atrakcji
    preferredLocations: [{
      type: String,
      enum: [
        "Obiekty sportowe (stadiony, hale sportowe)",
        "Kościoły, synagogi, meczety, świątynie",
        "Galerie handlowe i pasaże",
        "Ogrody zoologiczne, akwaria",
        "Miejsca historyczne (zamki, twierdze, bitwy)",
        "Targi i lokalne rynki",
        "Punkty widokowe",
        "Baseny i plaże"
      ],
      required: true,
    }]
});

// Tworzenie modelu na podstawie schematu
const Form = mongoose.model('Form', formSchema);

// Eksportowanie modelu, aby można było go używać w innych częściach aplikacji
module.exports = Form;