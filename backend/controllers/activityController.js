const Activity = require('../models/activityModel')
const City = require('../models/cityModel')

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}, { _id: 0 }).sort({ id_atrakcji: 1 });
  
        if (activities.length === 0) {
            console.log("Brak atrakcji w bazie danych");
        }

        console.log("Pobrano: ", activities.length, "atrakcji z bazy danych");
  
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
  
        console.log("Pobrano: ", activities.length, "atrakcji dla miasta: ", cityName);

        res.json(activities);
    } catch (err) {
      console.error('Błąd pobierania atrakcji dla miasta:', err);
      res.status(500).send('Błąd pobierania atrakcji dla miasta');
    }
};

const getActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findOne({ id_atrakcji: parseInt(id) }, { _id: 0 });
        
        if (!activity) {
            return res.status(404).json({ 
                success: false, 
                message: 'Atrakcja nie została znaleziona' 
            });
        }

        res.json({
            success: true,
            activity
        });
    } catch (err) {
        console.error('Błąd pobierania atrakcji:', err);
        res.status(500).json({
            success: false,
            message: 'Błąd pobierania atrakcji'
        });
    }
};

module.exports = {getActivities, getActivitiesInCity, getActivityById};