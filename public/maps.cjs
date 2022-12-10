//In a crazy fit of inspiration and definitely not desperation you decided to make two different map scripts, this one for static one 
//and another for non-static
//The other one will have this code you've bookmarked to track user location every five seconds
//you will be fetching the location and changing the map as it goes without re rendering
//NAME THEM ACCORDINGLY AND LEAVE SOME NOTES AS TO WHAT EACH DOES 

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
 * Creates map tile on current position
 */
let makeMap = (position) => { 

    map = L.map(document.querySelector('#map'), { 
        center: [position[0], position[1]], 
        zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

}

/**
 * Positions charging spots on map placing a pin on each of them
 */
let createPins = (spots) => { 

    for (let i of spots) { 
        let position = i.spcoordinates;
        console.log(position.x);
        let marker = L.marker([position.x, position.y]);
        marker.addTo(map);
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
            (json) => createPins(json)
        )
    )
}

window.addEventListener('DOMContentLoaded', (event) => { 
    
    let map;
    fetchPosition();
    fetchPins();

});