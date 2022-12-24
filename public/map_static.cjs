//instead of rendering the map again look for a way to, each time /locateInMap is routed by the search form, simply change the location here 
//for the map's center
//when you change location, do pins load again?

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