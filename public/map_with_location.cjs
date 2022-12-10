//add marker and circle that will be defined by user looking for nearby pins

/**
 * Makes initial map
 */
let makeMap = (position) => { 

    map = L.map(document.querySelector('#map'), { 
        center: position, 
        zoom: 20
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

/**
 * Called every five seconds to set new user location if geolocation is allowed by user 
 */
let setUserPosition = (position) => { 

    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(long);
    map.panTo(new L.LatLng(lat, long));

}

window.addEventListener('DOMContentLoaded', (event) => { 
    
    let map;
    let position = [38.246330, 21.734985];
    makeMap(position);
    fetchPins();
    if (!navigator.geolocation) {
        console.log("Your browser doesn't support geolocation feature!");
    } else {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(setUserPosition);
        }, 2000);
    }

});