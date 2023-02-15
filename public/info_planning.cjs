let currentPin;
let currentTrip;
let state = true;
let currentDate; 
let currentTime;
let duration;
let chargerAvailability = false;
let resList = [];

//Reservation button functions
let redirect = (reservationid) => { 
    if (reservationid) { 
        sessionStorage.removeItem('state');
        sessionStorage.removeItem('date');
        sessionStorage.removeItem('time');
        sessionStorage.removeItem('duration');
        window.location = '/map_planning';
    }
}

let makeReservation = (evt) => { 

    const body = { 
        date: currentDate, 
        starttime: currentTime, 
        endtime: duration, 
        userid: 1, 
        chargerid: evt.currentTarget.chargerid,
        spotid: Number(currentPin),
        tripid: currentTrip
    }

    //do a fetch post request here to make reservation
    fetch('/makeReservation', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    .then(
        (response) => response.json()
        .then(
            (json) => redirect(json)
        )
    )
    
}

//Info functions
let setAvailability = (i, text) => { 
    
    if (state == true) { 
        text.innerHTML = 'Unavailable';
        if (i.chavailability) { 
            text.innerHTML = 'Available';
        }
    }
    else { 
        text.innerHTML = 'Available';
        chargerAvailability = true;

        for (let j of resList) { 
            if (i.chargerid == j.reschargerid & i.chspotid == j.resspotid) { 
                if (j.resdate == currentDate) { 

                    let givenstartTime = currentTime + ":00";
                    givenstartTime = new Date(currentDate + "T" + givenstartTime);
                    givenstartTime = givenstartTime.getTime();
                    
                    let givenendTime = duration + ":00";
                    givenendTime = new Date(currentDate + "T" + givenendTime);
                    givenendTime = givenendTime.getTime();
                    
                    let resstartTime = j.resstarttime + ":00";
                    resstartTime = new Date(currentDate + "T" + resstartTime);
                    resstartTime = resstartTime.getTime();

                    let resendTime = j.resendtime + ":00";
                    resendTime  = new Date(currentDate + "T" + resendTime);
                    resendTime = resendTime.getTime();

                    if (givenstartTime <= resstartTime & resstartTime <= givenendTime) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                        break;
                    }
                    else if (givenstartTime <= resendTime & resendTime <= givenendTime) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                        break;
                    }
                    else if (resstartTime <= givenstartTime & givenendTime <= resendTime) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                        break;
                    }
                }
            }
        }
    }

    return chargerAvailability;

}

let setChargers = (i) => { 

    let div = document.createElement('div');
    div.className = 'charger-info';

    let info = document.createElement('div');
    info.className = "info";

    let type = document.createElement('span');
    type.className = "type";
    let text = document.createElement('p');
    text.innerHTML = i.chtype;
    type.appendChild(text);
    info.appendChild(type);

    //take current datetime into consideration each time
    let availability = document.createElement('span');
    availability.className = "availability";
    text = document.createElement('p');
    let current = setAvailability(i, text);
    if (current) { 
        availability.id = 'available';
    }
    else { 
        availability.id = 'unavailable';
    }
    availability.appendChild(text);
    info.appendChild(availability);

    let buttons = document.createElement('div');
    buttons.className = "buttons";

    let price = document.createElement('span');
    price.className = 'price_button';
    text = document.createElement('p');
    text.innerHTML = "Prices";
    price.appendChild(text);
    buttons.appendChild(price);

    let res = document.createElement('span');
    res.className = "res_button";
    if (!current) { 
        res.id = "no-button";
    }
    text = document.createElement('p');
    text.innerHTML = "Charge";
    res.appendChild(text);
    buttons.appendChild(res);

    //only allows button to be pressed if charger is available
    if (chargerAvailability == true) { 
        res.addEventListener('click', makeReservation);
        res.chargerid = i.chargerid;
        res.spotid = i.chspotid;
    }   

    div.appendChild(info);
    div.appendChild(buttons);

    let chargers = document.querySelector(".chargers");
    chargers.appendChild(div);

}

let setInfo = (pin) => { 

    let info_field = document.querySelector(".location_info");
    info_field.innerHTML = pin.splocationinfo;
    fetchChargers();
}

//Fetch functions
let findChargers = (chargers) => { 
    let chargerList = [];

    for (let i of chargers) {
        if (i.chspotid == currentPin) { 
            chargerList.push(i);
        }
        
    }
    for (let i of chargerList) { 
        setChargers(i);
    }
    
}

let fetchChargers = () => { 
    fetch('/chargers')
    .then(
        (response) => response.json()
        .then(
            (json) => findChargers(json)
        )
    )
}

let findPin = (pins) => { 
    for (let i of pins) { 
        if (i.spotid == currentPin) { 
            setInfo(i);
            break;
        }
    }
}

let fetchInfo = () => { 
    fetch('/pins')
    .then(
        (response) => response.json()
        .then(
            (json) => findPin(json)
        )
    )
}

let findReservations = (reservations) => { 
    for (let i of reservations) { 
        resList.push(i);
    }
    fetchInfo();
}

let fetchReservations = () => { 
    fetch('/reservations')
    .then(
        (response) => response.json()
        .then(
            (json) => findReservations(json)
        )
    )
}

let setTripId = (tripid) => { 
    currentTrip = tripid.tripid;
    fetchReservations();
}

let fetchTripId = () => { 
    fetch('/getTripId')
    .then(
        (response) => response.json()
        .then(
            (json) => setTripId(json)
        )
    )
} 

window.addEventListener('DOMContentLoaded', (event) => { 
    
    currentPin = sessionStorage.getItem('currentPin');

    if (sessionStorage.getItem('state') == 'false') { 
        state = false; 
        currentDate = sessionStorage.getItem('date');
        currentTime = sessionStorage.getItem('time');
        duration = sessionStorage.getItem('duration');
    }
    
    fetchTripId();

});