const express = require('express');
const fs = require('fs');
const path = require('path');
const cityRoutes = require('./routes/cityRoutes');
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 7777;
const login = process.env.MONGO_LOGIN;
const password = process.env.MONGO_PASSWORD;

// Middleware do obsługi CORS
app.use(cors());

// Middleware do obsługi JSON
app.use(express.json());

// Używamy tras związanych z miastami
app.use('/api', cityRoutes);

// Używamy tras autoryzacji
app.use('/api/auth', authRoutes);

// Prosta trasa testowa
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


mongoose.connect(`mongodb+srv://${login}:${password}@tipsfortrips.luxzdnn.mongodb.net/TipsForTrips?retryWrites=true&w=majority&appName=TipsForTrips`)
.then(() => console.log("Połączono z bazą danych MongoDB"))
.catch(err => console.error("Błąd połączenia z bazą MongoDB", err));


const db = mongoose.connection;
db.on('connected', () => {
  console.log('Połączono z bazą danych:', db.name);
});
db.on('error', (error) => {
  console.log('Błąd połączenia:', error);
});
