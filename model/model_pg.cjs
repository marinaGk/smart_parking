/**
 * Connects to database - returns data through 'controller files'
 */

const sql = require('./db.pg.js');

/**
 * Gets reservations for particular tripid
 */
let currentreservations = (tripid, callback) => {
    const query = { 
        text: 
        `SELECT * 
        FROM reservation 
        WHERE restripid = $1`,
        values: [tripid]
    } 

    sql.query(query, function(err, result){ 
        if (err) { 
            callback(err.stack)
        }
        else { 
            callback(null, result.rows);
        }
    })
}

/**
 * Makes reservation
 */
let reservation = (date, starttime, endtime, userid, chargerid, spotid, tripid, callback) => { 

    const query = { 
        text: 
        `INSERT INTO reservation(ResDate, ResStartTime, ResEndTime, ResUserID, ResChargerID, ResSpotID, ResTripID) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING reservationid`, 
        values: [date, starttime, endtime, userid, chargerid, spotid, tripid]
    }

    sql.query(query, function(err, result){ 
        if (err) { 
            callback(err.stack, null)
        }
        else { 
            callback(null, result.rows[0]);
        }
    })
}

/**
 * Selects all reservations from RESERVATION table
 */
let reservations = (callback) => { 
    
    const query = { 
        text: 
        `SELECT * 
        FROM reservation`
    } 

    sql.query(query, function(err, reservations){ 
        if (err) { 
            callback(err.stack)
        }
        else { 
            callback(null, reservations.rows)
        }
    })

}

/**
 * Creates new trip
 */
let trip = (tripname, callback) => { 

    const query = { 
        text: 
        `INSERT INTO trip(TripName, TripUserID) 
        VALUES ($1, $2) RETURNING tripid`, 
        values: [tripname, 1]
    }

    sql.query(query, function(err, result){ 
        if (err) { 
            callback(err.stack, null)
        }
        else { 
            callback(null, result.rows[0].tripid)
        }
    })

}

/**
 * Selects all spots from SPOT table
 */
let pins = (callback) => { 

    const query = { 
        text: 
        `SELECT * 
        FROM spot`
    }

    sql.query(query, function(err, pins){ 
        if (err) { 
            callback(err.stack)
        }
        else { 
            callback(null, pins.rows)
        }
    })

}

/**
 * Selects all chargers from CHARGER table
 */
let chargers = (callback) => { 

    const query = { 
        text: 
        `SELECT * 
        FROM charger`
    } 

    sql.query(query, function(err, chargers){ 
        if (err) { 
            callback(err.stack)
        }
        else { 
            callback(null, chargers.rows)
        }
    })

}

module.exports = {pins, chargers, reservations, trip, reservation, currentreservations};