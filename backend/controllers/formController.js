const Form = require('../models/formModel');
const Activity = require('../models/activityModel');
const City = require('../models/cityModel')

const cosineSimilarity = (vecA, vecB) => {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    keys.forEach(key => {
        const a = vecA[key] || 0;
        const b = vecB[key] || 0;
        dot += a * b;
        normA += a * a;
        normB += b * b;
    });
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Build a vector for the user based on their form answers.
const getUserVector = (formAnswers) => {
    let vector = {};

    // Add preferred locations
    if (Array.isArray(formAnswers.preferredLocations)) {
        formAnswers.preferredLocations.forEach(loc => {
            vector[loc] = 1;
        });
    }

    // Add interests as binary features
    if (formAnswers.historicalInterest === "Yes") {
        vector["historia"] = 1;
    } else if (formAnswers.historicalInterest === "Maybe") {
        vector["historia"] = 0.5; // Częściowe zainteresowanie
    }

    if (formAnswers.artInterest === "Yes") {
        vector["sztuka"] = 1;
    } else if (formAnswers.artInterest === "Maybe") {
        vector["sztuka"] = 0.5; // Częściowe zainteresowanie
    }

    // Add duration preference as a feature
    if (formAnswers.attractionDuration) {
        vector["duration_" + formAnswers.attractionDuration] = 1;
    }

    // Add slider-based preferences
    if (formAnswers.activityLevel) {
        vector["activityLevel"] = parseFloat(formAnswers.activityLevel) / 10; // Normalizuj do zakresu [0, 1]
    }
    if (formAnswers.locationPreference) {
        vector["locationPreference"] = parseFloat(formAnswers.locationPreference) / 10; // Normalizuj do zakresu [0, 1]
    }
    if (formAnswers.timeOfDayPreference) {
        vector["timeOfDayPreference"] = parseFloat(formAnswers.timeOfDayPreference) / 10; // Normalizuj do zakresu [0, 1]
    }
    if (formAnswers.crowdPreference) {
        vector["crowdPreference"] = parseFloat(formAnswers.crowdPreference) / 10; // Normalizuj do zakresu [0, 1]
    }
    if (formAnswers.adrenalineLevel) {
        vector["adrenalineLevel"] = parseFloat(formAnswers.adrenalineLevel) / 10; // Normalizuj do zakresu [0, 1]
    }
    if (formAnswers.startTimePreference) {
        vector["startTimePreference"] = parseFloat(formAnswers.startTimePreference) / 10; // Normalizuj do zakresu [0, 1]
    }

    return vector;
};

// Build a vector for an activity based on its attributes.
const getActivityVector = (activity) => {
    let vector = {};

    // Include each tag as a binary feature
    if (Array.isArray(activity.tagi)) {
        activity.tagi.forEach(tag => {
            vector[tag] = 1;
        });
    }

    // Add duration category based on czas_trwania
    if (activity.czas_trwania !== undefined) {
        if (activity.czas_trwania <= 2) {
            vector["duration_Short"] = 1;
        } else if (activity.czas_trwania <= 4) {
            vector["duration_Medium"] = 1;
        } else {
            vector["duration_Long"] = 1;
        }
    }

    // Add slider-based features (normalize to [0, 1])
    if (activity.aktywnosc !== undefined) {
        vector["activityLevel"] = activity.aktywnosc / 10;
    }
    if (activity.centrum !== undefined) {
        vector["locationPreference"] = activity.centrum / 10;
    }
    if (activity.zatloczenie !== undefined) {
        vector["crowdPreference"] = activity.zatloczenie / 10;
    }
    if (activity.adrenalina !== undefined) {
        vector["adrenalineLevel"] = activity.adrenalina / 10;
    }

    return vector;
};

const mapAnswersToForm = (answers) => {
    return {
        preferredLocations: answers[11] || [], // Multiple-choice odpowiedzi
        historicalInterest: answers[2], // Single-choice odpowiedź
        artInterest: answers[1], // Single-choice odpowiedź
        attractionDuration: answers[3], // Single-choice odpowiedź
        activityLevel: answers[4], // Slider odpowiedź
        locationPreference: answers[5], // Slider odpowiedź
        timeOfDayPreference: answers[6], // Slider odpowiedź
        crowdPreference: answers[7], // Slider odpowiedź
        paidAttractions: answers[8], // Single-choice odpowiedź
        adrenalineLevel: answers[9], // Slider odpowiedź
        startTimePreference: answers[10], // Slider odpowiedź
    };
};

const matchAttractions = async (req, res) => {
    try {
        const { miasto, answers} = req.body; // Oczekujemy tablicy odpowiedzi
        console.log("Miasto z żądania:", miasto);

        if (!miasto) {
            return res.status(400).json({ message: 'Brak parametru miasto w żądaniu' });
        }

        const id_miasta = await City.findOne({
            nazwa: { $regex: new RegExp('^' + miasto + '$', 'i') } // Dopasowanie do nazwy miasta (case-insensitive)
        }).then(city => city.id);
        // Mapowanie odpowiedzi na strukturę oczekiwaną przez getUserVector
        const formAnswers = mapAnswersToForm(answers);

        const activities = await Activity.find({ id_miasta: id_miasta }, { _id: 0 });
        const userVec = getUserVector(formAnswers);

        const matched = activities
            .map(activity => {
                const activityVec = getActivityVector(activity);
                const similarity = cosineSimilarity(userVec, activityVec);
                return { ...activity.toObject(), score: similarity };
            })
            .filter(activity => activity.score > 0);

        matched.sort((a, b) => b.score - a.score);

        // Zwróć tylko top 6 atrakcji
        const top6 = matched.slice(0, 6);
        console.log("Top ", top6.length," matched attractions (IDs):", top6);

        res.json(top6);
    } catch (error) {
        console.error("Error matching attractions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { matchAttractions };