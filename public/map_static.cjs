/**
 * Used by both location and static map
 */

let map;

/**
 * General charger icon
 */
let pinIcon = L.icon({ 

    //icon content is 15x21 which determines the anchor
    className: 'spot-pin',
    iconUrl: 'imgs/chargerPin.png', 
    iconAnchor: [12.5, 23]

});

/**
 * Positions charging spots on map placing a pin on each of them
 * Called by fetchPins
 */
let createPins = (spots) => { 

    let pins = {};

    for (let i of spots) { 
        let position = i.spcoordinates;
        pins[i.spotid] = L.marker([position.x, position.y], {icon: pinIcon}).addTo(map);
        pins[i.spotid].on('click', function(event) { 
           
            let spotid = i.spotid;
            localStorage.setItem('currentPin', spotid);
            window.location = "/pin_info";

        });
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
            (json) => createPins(json)
        )
    )
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

window.addEventListener('DOMContentLoaded', (event) => { 
    
    fetchPosition();
    fetchPins();

});