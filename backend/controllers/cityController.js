const City = require('../models/cityModel')


const getCities = async (req, res) => {
    try {
        console.log("Pobieranie miast z bazy...");
        const cities = await City.find({}, { _id: 0 }).sort({ id: 1 });
        console.log("Miasta pobrane:", cities);

        if (cities.length === 0) {
            console.log("Brak miast w bazie danych");
        }

        res.json(cities);
    } catch (err) {
        console.error("Błąd pobierania miast:", err);
        res.status(500).send('Błąd pobierania miast');
    }
};

const getCityDetails = async (req, res) => {
    const cityName = req.params.cityName;
    try {
        const city = await City.findOne({ nazwa: { $regex: new RegExp('^' + cityName + '$', 'i') } }); // Szukamy miasta "Barcelona"
        if (!city) {
            return res.status(404).json({ message: `Miasto ${cityName} nie zostało znalezione` });
          }
        res.json(city)
    } catch (err) {
        res.status(500).send('Błąd pobierania szczegółów miasta');
    }
};

module.exports = {getCities, getCityDetails};