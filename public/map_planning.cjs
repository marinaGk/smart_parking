//add routes between waypoints

let map;
let pinlist = [];

/**
 * General charger icon
 */
let pinIcon = L.icon({ 

    //icon content is 15x21 which determines the anchor
    iconUrl: 'imgs/chargerPin.png', 
    iconAnchor: [12.5, 23]

});

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
    let spotMarker = L.marker(spot, {icon: pinIcon}).addTo(map);
}

/**
 * Finds charging spots within radius of waypoint
 * Called by makeNewWaypoint
 * Calls createPin
 */
let findPins = (coordinates) => { 
    
    const radius = 5000;
    for (i of pinlist) { 
        let latLng = L.latLng(i.spcoordinates.x, i.spcoordinates.y);
        let distance = getDistance(coordinates, latLng);
        if (distance < radius) { 
            createPin(latLng);
        }
    }
}

/**
 * Makes new waypoint in route
 * Called by makeMap
 * Calls findPins
 */
let makeNewWaypoint = (coordinates) => { 
    let waypointMarker = L.marker(coordinates, {icon: pinIcon}).addTo(map);
    let circle = L.circle(coordinates, {
        color: '#2E3B51',
        radius: 5000,
        fillColor: '#2E3B51',
        opacity: 0.5
      }).addTo(map);
    findPins(coordinates);
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
    var btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
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
        let waypointButton = L.DomUtil.create('div');
        L.DomUtil.addClass(waypointButton, 'waypointButton');
        let waypoint = createButton('Trip location', waypointButton);
    
        L.popup()
            .setContent(waypointButton)
            .setLatLng(e.latlng)
            .openOn(map);

        L.DomEvent.on(waypoint, 'click', function() { 
            makeNewWaypoint(e.latlng); 
            map.closePopup();
        });
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