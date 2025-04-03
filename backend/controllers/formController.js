const Form = require('../models/formModel')

const getAnswers = async (req, res) => {
    const form = new Form({
        childrenPreferences: "Yes",
        artInterest: "Yes",
        historicalInterest: "Maybe",
        attractionDuration: "Short",
        
        activityLevel: 7,  // Aktywność na skali 1-10
        locationType: 3,  // Preferencje dotyczące typu lokalizacji (np. 1 - centrum, 10 - przyroda)
        crowdPreference: 2,  // Preferencje dotyczące tłumu (1 - spokojne, 10 - zatłoczone)
        visitTime: 1,  // Preferencje dotyczące pory dnia (1 - za dnia, 10 - w nocy)
        adrenalinePreference: 8,  // Ekstremalne atrakcje (1 - spokojne, 10 - ekstremalne)
        
        preferredLocations: [
            "Obiekty sportowe (stadiony, hale sportowe)",
            "Galerie handlowe i pasaże",
            "Miejsca historyczne (zamki, twierdze, bitwy)"
        ],
  
    });

    res.json(form)
}

module.exports = {getAnswers};