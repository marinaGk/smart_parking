let model = require('../model/model_pg.cjs');

function getCurrentReservations(req, res) { 
    model.currentreservations(req.session.tripid, (err, rows) => { 
        if(err) { 
            res.send(err); 
        }
        else { 
            res.send(rows);
        }
    });
}

function makeReservation(req, res) { 
    model.reservation(req.body.date, req.body.starttime, req.body.endtime, 
        req.body.userid, req.body.chargerid, req.body.spotid, req.body.tripid, (err, message) => { 
            if(err) { 
                res.send(err); 
            }
            else { 
                console.log(message);
                res.send(message);
            } 
        })
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

function unsetTrip(req, res) { 
    req.session.tripid = null;
    res.send({result: 1});
}

function getTripId(req, res) { 
    res.send({tripid: req.session.tripid});
}

/**
 * Posts trip name and makes trip
 */
function makeTrip(req, res) { 
    model.trip(req.body.trip, (err, message) => { 
        if(err) { 
            res.send(err); 
        }
        else { 
            req.session.tripid = message;
            res.redirect('/map_planning');
        }
    });
}

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

exports.getSpots = getSpots;
exports.getChargers = getChargers;
exports.getReservations = getReservations;
exports.makeTrip = makeTrip;
exports.unsetTrip = unsetTrip;
exports.getTripId = getTripId;
exports.makeReservation = makeReservation;
exports.getCurrentReservations = getCurrentReservations;