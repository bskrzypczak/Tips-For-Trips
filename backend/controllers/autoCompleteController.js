const City = require('../models/cityModel'); // Import modelu City

const getCitiesByPrefix = async (req, res) => {
    try {
        const { prefix } = req.query;
        if (!prefix) {
            return res.status(400).json({ message: 'Brak parametru prefix' });
        }

        // Wyszukaj miasta zaczynające się od prefix (case-insensitive)
        const matchingCities = await City.find({
            nazwa: { $regex: new RegExp('^' + prefix, 'i') }
        })
        .select('nazwa -_id')  // Pobierz tylko pole 'nazwa', bez '_id'
        .limit(10);  // Ogranicz liczbę wyników

        // Wyodrębnij same nazwy miast
        const cityNames = matchingCities.map(city => city.nazwa);
        
        res.json(cityNames);
    } catch (error) {
        console.error("Błąd wyszukiwania miast:", error);
        res.status(500).json({ message: "Błąd wyszukiwania miast" });
    }
}

module.exports = {
    getCitiesByPrefix
};