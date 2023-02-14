const express = require('express');
const router = express.Router();

const pinsController = require('../controllers/pinsContoller.cjs');
const mapSearch = require('../controllers/mapSearchController.cjs');

//Starting page 
router.route('/').get((req, res) => { 
    res.render('start_page', {layout: 'start_page_main.hbs', styles: 'start_page.css', title: "CHARGE UP"})
});

router.route('/map_static').get((req, res) => { 
    res.render('map_static.hbs', {layout: 'map_main.hbs', styles: "map_static.css", title: "CHARGE UP"})
});

router.route('/map_location').get((req, res) => { 
    res.render('map_location', {layout: 'map_main.hbs', title: "CHARGE UP"})
});

router.route('/map_planning').get((req, res) => { 
    if (req.session.tripid != null) { 
        res.render('map_planning', {layout: 'map_main.hbs', styles: "map_plan.css", title: "CHARGE UP"})
    }
    else{ 
        res.render('map_planning_start', {layout: 'start_page_main.hbs', styles: "map_plan_start.css", title: "CHARGE UP"})
    }
});

router.route('/pin_static').get((req, res) => { 
    res.render('info_static', {layout: 'info_main.hbs', style: 'info_page.css', title: "CHARGE UP"})
});

router.route('/pin_planning').get((req, res) => { 
    res.render('info_planning', {layout: 'info_main.hbs', style: 'info_planning.css', title: "CHARGE UP"})
});

//Reservation requests
router.post('/makeReservation', pinsController.makeReservation);

//Trip requests
router.post('/makeTrip', pinsController.makeTrip);
router.get('/unsetTrip', pinsController.unsetTrip);
router.get('/getTripId', pinsController.getTripId);

//Get requests
router.get('/pins', pinsController.getSpots);
router.get('/chargers', pinsController.getChargers);
router.get('/reservations', pinsController.getReservations);
router.get('/currentReservations', pinsController.getCurrentReservations);
router.get('/position', mapSearch.getPosition);

//Post requests
router.post('/locateInMap', mapSearch.mapSearchRequest, mapSearch.renderMap);

module.exports = router;