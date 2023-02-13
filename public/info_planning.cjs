let currentPin;
let state = true;
let currentDate; 
let currentTime;
let duration;
let chargerAvailability = false;
let resList = [];

//Reservation button functions
//notice how those will need to use the same popup as map planning in map static
//i say make a layout for info page and then use different popup for static (with details) and confirmation popup with location and planning
//use the same function each time, if static, currentDate will be set to chosen, as well as time and duration, if planning it is already set and if location, just pick duration and get the next from pc
//after making reservation don't forget to clear page if you're in static
let makeReservation = (evt) => { 

    const body = { 
        date: currentDate, 
        starttime: currentTime, 
        enttime: duration, 
        userid: 1, 
        chargerid: evt.currentTarget.chargerid,
        spotid: evt.currentTarget.chspotid
    }
    
    /*fetch('/makeReservation', { 
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err))*/

    alert (body.date);

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
                    console.log("givenstart", givenstartTime.getTime());
                    
                    let givenendTime = duration + ":00";
                    givenendTime = new Date(currentDate + "T" + givenendTime);
                    console.log("givenend", givenendTime.getTime());
                    
                    let resstartTime = j.resstarttime + ":00";
                    resstartTime = new Date(currentDate + "T" + resstartTime);
                    console.log("resstart", resstartTime.getTime());

                    let resendTime = j.resendtime + ":00";
                    resendTime  = new Date(currentDate + "T" + resendTime );
                    console.log("resend", resendTime.getTime());

                    if ((resstartTime.getTime() < givenstartTime.getTime() & givenstartTime.getTime() < resendTime.getTime()) ||
                    (resstartTime.getTime() < givenendTime.getTime() & givenendTime.getTime() < resendTime.getTime())) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                    }
                }
            }
        }
    }

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
    setAvailability(i, text);
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

}

//Fetch functions
let findReservations = (reservations) => { 
    for (let i of reservations) { 
        resList.push(i);
    }
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

window.addEventListener('DOMContentLoaded', (event) => { 
    
    currentPin = localStorage.getItem('currentPin');

    if (localStorage.getItem('state') == 'false') { 
        state = false; 
        currentDate = localStorage.getItem('date');
        currentTime = localStorage.getItem('time');
        duration = localStorage.getItem('duration');
    }
    
    fetchReservations();
    fetchInfo();
    fetchChargers();
});