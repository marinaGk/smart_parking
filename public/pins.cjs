/**
 * Used by 'map_interactive' view, this script creates the pins
 * A fetch request is make through '/pins' which is routed to call the 'getSpots' function on 'pinsController'
 * The 'getSpots' function then makes a request on the database through the model 
 * The 'createPins' function sets a pin on each of the charger spot locations
 */

let makeMap = () => { 

    map = L.map(document.querySelector('#map'), { 
        center: [38.246330, 21.734985], 
        zoom: 13
    });

    var tiles = L.esri.basemapLayer("Streets").addTo(map);
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

}

let createPins = (spots) => { 

    for (let i of spots) { 
        let position = i.spcoordinates;
        console.log(position.x);
        let marker = L.marker([position.x, position.y]);
        marker.addTo(map);
    }
}

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
    makeMap();
    fetchPins();

});