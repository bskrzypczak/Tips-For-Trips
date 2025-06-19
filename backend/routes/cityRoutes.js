const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const activityController = require('../controllers/activityController');
const formController = require('../controllers/formController');
const autoCompleteController = require('../controllers/autoCompleteController');

router.get('/cities/search', autoCompleteController.getCitiesByPrefix);

router.get('/cities/:cityName', cityController.getCityDetails);
router.get('/cities/:cityName/activities', activityController.getActivitiesInCity);

router.get('/activities', activityController.getActivities);
router.post('/match', formController.matchAttractions);
router.get('/cities', cityController.getCities);

module.exports = router;