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

exports.getSpots = getSpots;