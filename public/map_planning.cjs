//add routes between waypoints

let map;
let currentLocation;
let pinlist = [];
let modal = document.querySelector('.modal-container');
let state = true;
let timevar; 
let datevar; 

/**
 * General charger icon
 */
let pinIcon = L.icon({ 

    //icon content is 15x21 which determines the anchor
    iconUrl: 'imgs/chargerPin.png', 
    iconAnchor: [12.5, 23]

});

//Info functions
let proceedWithInfo = () => { 
    datevar = document.getElementById("date").value;
    timevar = document.getElementById("time").value;
    modal.style.zIndex = -1;
    state = false;
    makeNewWaypoint(currentLocation);
}

let cancel = () => { 
    currentLocation = undefined;
    modal.style.zIndex = -1;
}

//Waypoint functions
/**
 * Finds distance between charging spots
 * Called by findPins
 */
let getDistance = (from, to) => { 
    let distance = from.distanceTo(to);
    return distance;
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
 * Finds charging spots within radius of waypoint
 * Called by makeNewWaypoint
 * Calls createPin
 */
let findPins = (coordinates) => { 
    
    const radius = 5000;
    let validpins = [];
    for (i of pinlist) { 
        let latLng = L.latLng(i.spcoordinates.x, i.spcoordinates.y);
        let distance = getDistance(coordinates, latLng);
        if (distance < radius) { 
            let marker = createPin(latLng);
            marker.on('click', function() { 
                let spotid = i.spotid;
                localStorage.setItem('currentPin', spotid);
                window.location = "/pin_info";
            });
            validpins.push(marker);
        }
    }

    return validpins;
}

/**
 * Makes new waypoint in route
 * Called by makeMap
 * Calls findPins
 */
let makeNewWaypoint = (coordinates) => { 

    let waypointMarker = L.marker(coordinates, {icon: pinIcon}).addTo(map);
    let cancelButton = L.DomUtil.create('div');
    L.DomUtil.addClass(cancelButton, 'waypoint-button');
    let cancelation = createButton('Cancel location', cancelButton);
    waypointMarker.bindPopup(cancelation);

    let circle = L.circle(coordinates, {
        color: '#2E3B51',
        radius: 5000,
        fillColor: '#2E3B51',
        opacity: 0.5
    }).addTo(map);

    let pins = findPins(coordinates);
    let pinsLayer = L.layerGroup(pins).addTo(map);

    L.DomEvent.on(cancelation, 'click', function() { 
        map.removeLayer(waypointMarker);
        map.removeLayer(circle);
        map.removeLayer(pinsLayer);
        state = true;
        timevar = undefined;
        datevar = undefined;
    });

}

//General functions
/**
 * Creates an array of all pins
 * Called by fetch pins in the beginning
 */
let createPinList = (spots) => { 

    for (let i of spots) { 
        pinlist.push(i);
    }

}

/**
 * Uses fetch-api to get charging spot locations from database
 * Called when content loads
 * Calls createPinList
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

/**
 * Makes waypoint button to pick location on trip
 * Called by makeMap
 */
let createButton = (label, container) => {
    let btn = L.DomUtil.create('input', '', container);
    btn.setAttribute('type', 'submit');
    btn.setAttribute('value', label);
    return btn;
}

/**
 * Creates map tile on current position
 * Adds ability to click on map with popup to add waypoint
 * Called by fetchPosition in beginning
 * Calls makeNewWaypoint when popup is used
 */
let makeMap = (position) => { 

    map = L.map(document.querySelector('#map'), { 
        center: [position[0], position[1]], 
        zoom: 9
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

    map.on('click', function(e) {
        if (state) {
            let waypointButton = L.DomUtil.create('div');
            L.DomUtil.addClass(waypointButton, 'waypoint-button');
            let waypoint = createButton('Trip location', waypointButton);
            L.popup().setContent(waypoint).setLatLng(e.latlng).openOn(map);
            
            L.DomEvent.on(waypoint, 'click', function() { 
                currentLocation = e.latlng;
                map.closePopup();
                modal.style.zIndex = 1050;
                let button = document.querySelector(".submit");
                button.addEventListener('click', proceedWithInfo);
                let cancelButton = document.querySelector(".close");
                cancelButton.addEventListener('click', cancel);
            });
        }
    });

}

/**
 * Uses fetch-api to get current position on map and create tile
 * Called when content loads
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

window.addEventListener('DOMContentLoaded', (event) => { 
    
    fetchPosition();
    fetchPins();

});