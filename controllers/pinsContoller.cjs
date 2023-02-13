let model = require('../model/model_pg.cjs');

/**
 * Gets all known spots from database
 */
function getSpots(req, res) { 
    model.pins((err, rows) => { 
        if(err) { 
            res.send(err); 
        }
        else { 
            res.send(rows);
        }
    });
}

/**
 * Gets all known chargers from database
 */
function getChargers(req, res) { 
    model.chargers((err, rows) => { 
        if(err) { 
            res.send(err); 
        }
        else { 
            res.send(rows);
        }
    });
}

/**
 * Gets all known reservations from database
 */
function getReservations(req, res) { 
    model.reservations((err, rows) => { 
        if(err) { 
            res.send(err); 
        }
        else { 
            res.send(rows);
        }
    });
}

exports.getSpots = getSpots;
exports.getChargers = getChargers;
exports.getReservations = getReservations;