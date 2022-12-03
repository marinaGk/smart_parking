/**
 * Connects to 'model' to receive database data activated through fetch API
 */

let model = require('../model/model_pg.cjs');

/**
 * function to get all known spots from database
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

exports.getSpots = getSpots;