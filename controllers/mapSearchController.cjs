const traveltimeApi = require('traveltime-api');
const dotenv = require('dotenv');
dotenv.config();

const travelTimeClient = new traveltimeApi.TravelTimeClient({
  apiKey: process.env.API_KEY,
  applicationId: process.env.APPLICATION_ID,
});

let position = [38.246330, 21.734985];

/**
 * Returns current position to caller
 */
let getPosition = (req, res) => { 
    res.send(position);
}

/**
 * Called every time there's a change in location to re-render map main page with current position as center
 */
let renderMap = (req, res) => { 
    res.redirect('/');
}

/**
 * Makes request to timetravel api for geocoding and calls renderMap to change map's position
 */
let mapSearchRequest = (req, res, next) => { 
    console.log(req.body);
    travelTimeClient.geocoding(req.body)
    .then(
        (data) => { 
            position[0] = data.features[0].geometry.coordinates[1];
            position[1] = data.features[0].geometry.coordinates[0];
            next();
        }
    )
}

exports.mapSearchRequest = mapSearchRequest;
exports.getPosition = getPosition;
exports.renderMap = renderMap;