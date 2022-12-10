const express = require('express');
const router = express.Router();

const pinsController = require('../controllers/pinsContoller.cjs');
const mapSearch = require('../controllers/mapSearchController.cjs');

//Starting page - map centered on patras
router.route('/').get((req, res) => {
    res.render('map_static', {style: "main.css", title: "Search in map"});
});

router.route('/with_location').get((req, res) => { 
    res.render('map_location', {style: "main.css", title: "With geolocation"})
});

//Get requests
router.get('/pins', pinsController.getSpots);
router.get('/position', mapSearch.getPosition);

//Post requests
router.post('/locateInMap', mapSearch.mapSearchRequest, mapSearch.renderMap);

module.exports = router;