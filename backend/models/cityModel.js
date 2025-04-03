const mongoose = require('mongoose');

// Definicja schematu dla miasta
const citySchema = new mongoose.Schema({
  id: {
    type: Number,        // Id miasta, liczba
    required: true,      // Pole obowiązkowe
    unique: true         // Zapewnia unikalność id w bazie danych
  },
  nazwa: {
    type: String,        // Nazwa miasta
    required: true       // Pole obowiązkowe
  },
  region: {
    type: String,        // Region, w którym znajduje się miasto
    required: true       // Pole obowiązkowe
  },
  kraj: {
    type: String,        // Kraj, w którym znajduje się miasto
    required: true       // Pole obowiązkowe
  }
}, { collection: 'Cities'});

// Tworzenie modelu na podstawie schematu
const City = mongoose.model('City', citySchema);

// Eksportowanie modelu, aby można było go używać w innych częściach aplikacji
module.exports = City;
