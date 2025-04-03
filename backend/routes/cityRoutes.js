const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const activityController = require('../controllers/activityController');
const formController = require('../controllers/formController');

router.get('/cities', cityController.getCities);

router.get('/activities', activityController.getActivities);

router.get('/cities/:cityName', cityController.getCityDetails);

router.get('/cities/:cityName/activities', activityController.getActivitiesInCity);

router.get('/form/answers', formController.getAnswers);


module.exports = router;