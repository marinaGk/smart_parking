let marker; 
let circle;
let counter = 0;
let timeout = 3000;

/**
 * Options for geolocation
 */
const options = {
    enableHighAccuracy: true
};

/**
 * Pin to indicate used location
 */
let positionIcon = L.icon({

    //icon size is 20x20 which determines the anchor 
    iconUrl: 'imgs/location.png', 
    iconAnchor:   [11, 7]
});

/**
 * Called every five seconds to set new user location if geolocation is allowed by user 
 */
let setUserPosition = (position) => { 

    //checks if there's marker already 
    if (map.hasLayer(marker)) {
        map.removeLayer(marker); 
        map.removeLayer(circle);
    }

    //moves map
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    if (counter == 0) { 
        map.panTo(new L.latLng(lat, long));
        counter = 1; 
    }

    //makes marker and radius in new location
    marker = L.marker([lat, long], {icon: positionIcon}).addTo(map);
    circle = L.circle({lat: lat, lng: long}, {
        color: '#2E3B51',
        radius: 5000,
        fillColor: '#2E3B51',
        opacity: 0.5
      }).addTo(map);
}

/**
 * Fix this one 
 */
let error = (err) => { 
    console.log("error geolocating")
}

window.addEventListener('DOMContentLoaded', (event) => { 

    if (!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!");
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(setUserPosition, error, options);
        }, timeout);
    }

});