/**
 * Connects to database - returns data through 'controller files'
 */

const sql = require('./db.pg.js');


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

module.exports = {pins, chargers, reservations};