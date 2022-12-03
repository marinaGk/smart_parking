const express = require('express');
const router = express.Router();

router.route('/').get((req, res) => {
    res.render('map_interactive', {style: "main.css", title: "Is this a map?"});
});

module.exports = router;