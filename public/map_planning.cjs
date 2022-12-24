let map;
let pinlist = [];

/**
 * Uses fetch-api to get current position on map and create tile
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
 * Makes waypoint button to pick location on trip
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
            makeNewWaypoint(map, e.latlng); 
            map.closePopup();
        });
    });

}

/**
 * Makes new waypoint in route
 */
let makeNewWaypoint = (map, coordinates) => { 
    let waypointMarker = L.marker(coordinates);
    waypointMarker.addTo(map);
    /*L.DomUtil.addClass(waypointMarker, 'waypointMarker');*/

    findPins(coordinates);
}

/**
 * Called by findPins() to check for close spots
 */
let getDistance = (from, to) => { 
    let distance = from.distanceTo(to);
    return distance;
}

/**
 * Creates markers for spots within radius of waypoint 
 */
let createPin = (spot) => { 
    let spotMarker = L.marker(spot);
    spotMarker.addTo(map);
}

/**
 * Finds charging spots within radius of waypoint
 */
let findPins = (coordinates) => { 
    
    const radius = 10000;
    for (i of pinlist) { 
        let latLng = L.latLng(i.spcoordinates.x, i.spcoordinates.y);
        let distance = getDistance(coordinates, latLng);
        if (distance < radius) { 
            createPin(latLng);
        }
    }
}

/**
 * Creates an array of all pins
 */
let createPinList = (spots) => { 

    for (let i of spots) { 
        pinlist.push(i);
    }

}

/**
 * Uses fetch-api to get charging spot locations from database and calls createPins to position them on map
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
    
    fetchPosition();
    fetchPins();

});