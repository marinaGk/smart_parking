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

module.exports = {pins};