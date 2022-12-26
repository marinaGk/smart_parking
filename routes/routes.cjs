const express = require('express');
const router = express.Router();

const pinsController = require('../controllers/pinsContoller.cjs');
const mapSearch = require('../controllers/mapSearchController.cjs');

//Starting page 
router.route('/').get((req, res) => { 
    res.render('start_page', {layout: 'start_page_main.hbs'})
});

router.route('/map_static').get((req, res) => { 
    res.render('map_static.hbs', {layout: 'map_main.hbs', title: "CHARGE UP"})
});

router.route('/map_location').get((req, res) => { 
    res.render('map_location', {layout: 'map_main.hbs', title: "CHARGE UP"})
});

router.route('/map_planning').get((req, res) => { 
    res.render('map_planning', {layout: 'map_main.hbs', title: "CHARGE UP"})
});

//Get requests
router.get('/pins', pinsController.getSpots);
router.get('/position', mapSearch.getPosition);

//Post requests
router.post('/locateInMap', mapSearch.mapSearchRequest, mapSearch.renderMap);

module.exports = router;