const traveltimeApi = require('traveltime-api');
const dotenv = require('dotenv');
dotenv.config();

const travelTimeClient = new traveltimeApi.TravelTimeClient({
  apiKey: process.env.API_KEY,
  applicationId: process.env.APPLICATION_ID,
});

const constMapPosition = [38.246330, 21.734985];
let mapPosition = [38.246330, 21.734985];

/**
 * Returns current position to caller
 */
let getPosition = (req, res) => { 
    res.send(mapPosition);
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
    travelTimeClient.geocoding(req.body)
    .then(
        (data) => { 
            console.log(data.features[0]);
            if (data.features[0] != undefined) { 
                mapPosition[0] = data.features[0].geometry.coordinates[1];
                mapPosition[1] = data.features[0].geometry.coordinates[0];
            }
            else { 
                mapPosition = constMapPosition;
            }
            next();
        }
    )
}

let mapClickRequest = (req, res) => { 
    travelTimeClient.geocodingReverse({
        params: {
          lat: 51.507281, lng: -0.132120,
        },
      }).then((data) => console.log(data))
        .catch((e) => console.error(e));
}

exports.mapSearchRequest = mapSearchRequest;
exports.getPosition = getPosition;
exports.renderMap = renderMap;
exports.mapClickRequest = mapClickRequest;