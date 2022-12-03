/**
 * Used by 'map_interactive' view, this script creates the pins
 * A fetch request is make through '/pins' which is routed to call the 'getSpots' function on 'pinsController'
 * The 'getSpots' function then makes a request on the database through the model 
 * The 'createPins' function sets a pin on each of the charger spot locations
 */

let createPins = (spots) => { 
    
    for (let i of spots) { 
        let position = i.spcoordinates;
        console.log(position);
        //let marker = L.marker([])
        //document.getElementById['map']
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

    fetchPins();

});