let currentPin;
let currentDate; 
let currentTime;
let duration;
let chargerAvailability = false;
let resList = [];

//Reservation button functions
let redirect = (check) => { 
    if (check) { 
        window.location = '/';
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
        tripid: null
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

let setAvailability = (i, text) => { 

    if (i.chavailability == false) { 
        text.innerHTML = 'Unavailable';
        chargerAvailability = false;
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
                    onehourInterval = givenstartTime + 3600000;
                    
                    let givenendTime = duration + ":00";
                    givenendTime = new Date(currentDate + "T" + givenendTime);
                    givenendTime = givenendTime.getTime();
    
                    let resstartTime = j.resstarttime + ":00";
                    resstartTime = new Date(currentDate + "T" + resstartTime);
                    resstartTime = resstartTime.getTime();
    
                    let resendTime = j.resendtime + ":00";
                    resendTime  = new Date(currentDate + "T" + resendTime );
                    resendTime = resendTime.getTime();
    
                    if (givenstartTime <= resstartTime & resstartTime <= onehourInterval) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                        break; 
                    }
                    else if (givenstartTime <= resendTime & resendTime <= onehourInterval) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                        break; 
                    }
                    else if (resstartTime <= givenstartTime & givenendTime <= onehourInterval) { 
                        text.innerHTML = 'Unavailable';
                        chargerAvailability = false;
                        break;
                    }
                    else { 
                        if (onehourInterval <= resstartTime & resstartTime <= givenendTime) { 
                            text.innerHTML = 'Unavailable';
                            chargerAvailability = false;
                            break;
                        }
                        else if (onehourInterval <= resendTime & resendTime <= givenendTime) { 
                            text.innerHTML = 'Unavailable';
                            chargerAvailability = false;
                            break;
                        }
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
    text.innerHTML = i.chprice;
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

}

//Fetch functions
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
    fetchChargers();
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
    
    currentPin = sessionStorage.getItem('currentPin');
    duration = sessionStorage.getItem('duration');
    
    currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, '0');
    let mm = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    let yyyy = currentDate.getFullYear();

    currentDate = yyyy + '-' + mm + '-' + dd;
    
    currentTime = new Date();
    let mins = currentTime.getMinutes();
    if ((mins.toString()).length == 1) { 
        mins = "0" + mins.toString();
    }
    else { 
        mins = mins.toString();
    }
    let hours = currentTime.getHours();
    if ((hours.toString()).length == 1) { 
        hours = "0" + hours.toString();
    }
    else { 
        hours = hours.toString();
    }
    currentTime = hours + ":" + mins;

    fetchReservations();

});