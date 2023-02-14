/*
Used only in planning to create trip
*/

let startTrip = () => { 

    let tripModal = document.querySelector('.trip-modal-container');
    tripModal.style.display = 'block';
    tripModal.style.zIndex = 1050;

    let closeButton = document.querySelector('.trip-close'); 
    closeButton.addEventListener('click', function() { 
        window.location = '/';
    })

}

window.addEventListener('DOMContentLoaded', (event) => { 
    
    startTrip();

});