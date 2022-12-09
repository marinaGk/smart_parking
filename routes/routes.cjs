const express = require('express');
const router = express.Router();

const pinsController = require('../controllers/pinsContoller.cjs');
const mapSearch = require('../controllers/mapSearchController.cjs');

//Starting page - map centered on patras
router.route('/').get((req, res) => {
    res.render('map_interactive', {style: "main.css", title: "Wow, new map"});
});

//Get requests
router.get('/pins', pinsController.getSpots);
router.get('/position', mapSearch.getPosition);

//Post requests
router.post('/locateInMap', mapSearch.mapSearchRequest, mapSearch.renderMap);

module.exports = router;