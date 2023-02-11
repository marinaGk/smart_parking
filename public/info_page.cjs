let currentPin;

let setChargers = (chargerList) => { 
    for (let i of chargerList) { 

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

        let availability = document.createElement('span');
        availability.className = "availability";
        text = document.createElement('p');
        if (i.chavailability == 'true'){ 
            text.innerHTML = 'Available';
        }
        else { 
            text.innerHTML = 'Unavailable';
        };
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

        div.appendChild(info);
        div.appendChild(buttons);

        let chargers = document.querySelector(".chargers");
        chargers.appendChild(div);

    }
}

let findChargers = (chargers) => { 
    let chargerList = [];

    for (let i of chargers) {
        if (i.chspotid == currentPin) { 
            chargerList.push(i);
        }
        
    }
    setChargers(chargerList);
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

let setInfo = (pin) => { 

    let info_field = document.querySelector(".location_info");
    info_field.innerHTML = pin.splocationinfo;

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

let postId = () => { 
    currentPin = localStorage.getItem('currentPin');
    console.log(currentPin);
}

window.addEventListener('DOMContentLoaded', (event) => { 
    postId();
    fetchInfo();
    fetchChargers();
});