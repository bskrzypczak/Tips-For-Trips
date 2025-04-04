const Activity = require('../models/activityModel')
const City = require('../models/cityModel')

const getActivities = async (req, res) => {
    try {
        console.log("Pobieranie atrakcji z bazy...");
        const activities = await Activity.find({}, { _id: 0 }).sort({ id_atrakcji: 1 });
  
        if (activities.length === 0) {
            console.log("Brak atrakcji w bazie danych");
        }
  
        res.json(activities);
    } catch (err) {
        console.error("Błąd pobierania atrakcji:", err);
        res.status(500).send('Błąd pobierania atrakcji');
    }
}

const getActivitiesInCity = async (req, res) => {
    const cityName = req.params.cityName;  // Pobieramy nazwę miasta z URL
  
    try {
        const city = await City.findOne({
            nazwa: { $regex: new RegExp('^' + cityName + '$', 'i') }  // Dopasowanie do nazwy miasta (case-insensitive)
        });
  
        if (!city) {
            return res.status(404).json({ message: `Miasto ${cityName} nie zostało znalezione` });
        }
  
        const cityId = city.id;
  
        const activities = await Activity.find({ id_miasta: cityId }, {_id: 0});
  
        if (activities.length === 0) {
            return res.status(404).json({ message: `Brak atrakcji dla miasta ${cityName}, o id ${cityId}` });
        }
  
        res.json(activities);
    } catch (err) {
      console.error('Błąd pobierania atrakcji dla miasta:', err);
      res.status(500).send('Błąd pobierania atrakcji dla miasta');
    }
};

module.exports = {getActivities, getActivitiesInCity};