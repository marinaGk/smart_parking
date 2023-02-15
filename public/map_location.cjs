let marker; 
let circle;
let pinlist = [];
let modal = document.querySelector('.res-modal-container');
let counter = 0;
let timeout = 3000;

/**
 * Options for geolocation
 */
const options = {
    enableHighAccuracy: true
};

/**
 * General charger icon
 */
let pinIcon = L.icon({ 

    //icon content is 15x21 which determines the anchor
    iconUrl: 'imgs/chargerPin.png', 
    iconAnchor: [12.5, 23]

});

/**
 * Pin to indicate used location
 */
let positionIcon = L.icon({

    //icon size is 20x20 which determines the anchor 
    iconUrl: 'imgs/location.png', 
    iconAnchor:   [11, 7]
});

/**
 * Sets sessionStorage values to store current pin for reservation in trip 
 * Called by makeMap once popup is filled
 * Calls makeNewWaypoint
 */
let proceedWithInfo = () => { 

    durvar = document.getElementById("duration").value;
    sessionStorage.setItem('duration', durvar);
    modal.style.zIndex = -1;
    modal.style.display = 'none';
    window.location = '/pin_location';

}

/**
 * Cancels current pin for reservation and closes popup
 * Called by openModal to cloce popup
 */
let cancel = () => { 
    modal.style.zIndex = -1;
    modal.style.display = 'none';
}

/**
 * Opens modal for reservation details 
 * Called by findPins
 */
let openModal = () => { 
    modal.style.display = 'block';
    modal.style.zIndex = 1050;

    let button = document.querySelector(".submit");
    button.addEventListener('click', proceedWithInfo);
    let cancelButton = document.querySelector(".res-close");
    cancelButton.addEventListener('click', cancel);

}

/**
 * Creates markers for spots within radius of waypoint 
 * Called by findPins
 */
let createPin = (spot) => { 
    let spotMarker = L.marker(spot, {icon: pinIcon});
    return spotMarker;
}

/**
 * Finds distance between charging spots
 * Called by findPins
 */
let getDistance = (from, to) => { 
    let distance = from.distanceTo(to);
    return distance;
}

/**
 * Finds charging spots within radius of waypoint
 * Called by setUserPosition
 * Calls createPin
 */
let findPins = (coordinates) => { 

    const radius = 5000;
    let validpins = [];

    for (let i of pinlist) {     
        let latLng = L.latLng(i.spcoordinates.x, i.spcoordinates.y);
        let distance = getDistance(coordinates, latLng);
        if (distance < radius) { 
            let marker = createPin(latLng);
            marker.on('click', function() { 
                let spotid = i.spotid;
                sessionStorage.setItem('currentPin', spotid);
                openModal();
            });
            validpins.push(marker);
        }
    }
    
    return validpins;
}

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

    let pins = findPins(L.latLng(lat, long));
    let pinsLayer = L.layerGroup(pins).addTo(map);

}

/**
 * Creates map tile on current position
 * Called by fetchPosition
 */
let makeMap = (position) => { 

    map = L.map(document.querySelector('#map'), { 
        center: [position[0], position[1]], 
        zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

}

/**
 * Uses fetch-api (calls mapSearch.getPosition) to get current position on map and create tile
 * Calls makeMap
 */
let fetchPosition = () => { 
    fetch('/position')
    .then( 
        (response) => response.json()
        .then( 
            (json) => makeMap(json)
        )
    )
}

/**
 * Fix this one 
 */
let error = (err) => { 
    console.log("error geolocating")
}

/**
 * Positions charging spots on map placing a pin on each of them
 * Called by fetchPins
 */
let createPinList = (spots) => { 
    for (let i of spots) { 
        pinlist.push(i);
    }
}

/**
 * Uses fetch-api (calls pinsController.getSpots) to get charging spot locations from database 
 * Calls createPins
 */
let fetchPins = () => { 
    fetch('/pins')
    .then(
        (response) => response.json()
        .then(
            (json) => createPinList(json)
        )
    )
}

window.addEventListener('DOMContentLoaded', (event) => { 

    fetchPins();
    fetchPosition();
    if (!navigator.geolocation) {
        alert("Your browser doesn't support geolocation feature!");
    } else {
        /*setInterval(() => {
            navigator.geolocation.getCurrentPosition(setUserPosition, error, options);
        }, timeout);*/
        navigator.geolocation.watchPosition(setUserPosition, error, options);
    }

});