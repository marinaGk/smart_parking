/**
 * Routes all actions in apps, connecting different pages to each other
 */

const express = require('express');
const router = express.Router();

const pinsController = require('../controllers/pinsContoller.cjs');

router.route('/').get((req, res) => {
    res.render('map_interactive', {style: "main.css", title: "Is this a map?"});
});

router.get('/pins', pinsController.getSpots);

module.exports = router;