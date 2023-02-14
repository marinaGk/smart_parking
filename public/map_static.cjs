/**
 * Used by both location and static map
 */
let map;
let pinlist = [];
let modal = document.querySelector('.res-modal-container');

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
 * Sets sessionStorage values to store current pin for reservation
 * Called by openModal
 * Moves to pin info window
 */
let proceedWithInfo = () => { 

    datevar = document.getElementById("date").value;
    sessionStorage.setItem('date', datevar);
    timevar = document.getElementById("time").value;
    sessionStorage.setItem('time', timevar);
    durvar = document.getElementById("duration").value;
    sessionStorage.setItem('duration', durvar);
    modal.style.zIndex = -1;
    modal.style.display = 'none';
    window.location = '/pin_static';

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
 * Called by createPins
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
 * Positions charging spots on map placing a pin on each of them
 * Called by makeMap
 */
let createPins = () => { 

    let pins = {};

    for (let i of pinlist) { 
        let position = i.spcoordinates;
        pins[i.spotid] = L.marker([position.x, position.y], {icon: pinIcon}).addTo(map);
        pins[i.spotid].on('click', function(event) { 
           
            let spotid = i.spotid;
            sessionStorage.setItem('currentPin', spotid);
            openModal();

        });
    }

}

/**
 * Positions charging spots on map placing a pin on each of them
 * Called by fetchPins
 */
let createPinList = (spots) => { 
    for (let i of spots) { 
        pinlist.push(i);
    }
    fetchPosition();
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

    createPins();

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
    
    fetchPins();

});