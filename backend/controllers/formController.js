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

const calculateDistance = (activity1, activity2) => {
    const toRad = deg => deg * Math.PI / 180;

    const { szerokosc: lat1, dlugosc: lon1 } = activity1.lokalizacja;
    const { szerokosc: lat2, dlugosc: lon2 } = activity2.lokalizacja;

    const R = 6371; // Promień Ziemi w kilometrach

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    let speedKmPerHour = 15; // Prędkość 60 km/h

    if (distanceKm < 1) {
        speedKmPerHour = 5;
    }
    else if (distanceKm > 6) {
        speedKmPerHour = 25;
    }
    const speedKmPerMin = speedKmPerHour / 60;
    const travelTimeMin = distanceKm / speedKmPerMin;

    return travelTimeMin
};

const buildTravelMatrix = (activities) => {
    const n = activities.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const time = calculateDistance(activities[i], activities[j]);
            matrix[i][j] = time;
        }
    }

    console.log("Macierz czasów przejazdu (w minutach):");
    console.table(matrix);

    return matrix;
};

const addMinutesToTime = (timeStr, minutesToAdd) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + minutesToAdd);

    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const roundUpTo15 = (minutes) => Math.ceil(minutes / 15) * 15;

const createDailyPlans = (activities, travelMatrix, numberOfDays) => {
    const dailyPlans = [];
    const used = new Set();

    const getClosestUnvisited = (fromIndex) => {
        const distances = travelMatrix[fromIndex]
            .map((time, index) => ({ index, time }))
            .filter(entry => !used.has(entry.index) && entry.index !== fromIndex);

        distances.sort((a, b) => a.time - b.time);
        return distances.map(d => d.index); // posortowane indeksy po czasie
    };

    for (let day = 0; day < numberOfDays; day++) {
        const dayPlan = [];
        let currentTime = "09:00"; // start każdego dnia

        // znajdź niewybraną atrakcję z najwyższym score
        const startIdx = activities.findIndex((a, idx) => !used.has(idx));
        if (startIdx === -1) break;

        let currentIdx = startIdx;
        for (let visit = 0; visit < 4; visit++) {
            if (used.has(currentIdx)) break;

            const activity = { ...activities[currentIdx] };
            activity.startTime = currentTime;

            dayPlan.push(activity);
            used.add(currentIdx);

            // Zaktualizuj czas po wizycie
            currentTime = addMinutesToTime(currentTime, activity.czas_trwania * 60);

            // Po 2 atrakcjach dodaj przerwę obiadową
            if (visit === 1) {
                currentTime = addMinutesToTime(currentTime, 120); // 2h obiadu
            }

            // Wybierz kolejną najbliższą atrakcję (jeszcze nieużytą)
            const nextCandidates = getClosestUnvisited(currentIdx);
            if (nextCandidates.length === 0) break;

            const nextIdx = nextCandidates[0];
            const travelTime = roundUpTo15(travelMatrix[currentIdx][nextIdx]);

            currentTime = addMinutesToTime(currentTime, travelTime);
            currentIdx = nextIdx;
        }

        dailyPlans.push({
            day: `Dzień ${day + 1}`,
            activities: dayPlan
        });
    }

    return dailyPlans;
};

const matchAttractions = async (req, res) => {
    try {
        const {startDate, endDate, miasto, answers} = req.body; // Oczekujemy tablicy odpowiedzi
        console.log("Miasto z żądania:", miasto);
        console.log(startDate, endDate);
        console.log(answers)

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffMs = end - start;

        const numberOfDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

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

        const toPlan = matched.slice(0, numberOfDays * 5);

        const travelMatrix = buildTravelMatrix(toPlan);

        const dailyPlans = createDailyPlans(toPlan, travelMatrix, numberOfDays);
        console.log(JSON.stringify(dailyPlans, null, 2));

        res.json(top6);
    } catch (error) {
        console.error("Error matching attractions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { matchAttractions };