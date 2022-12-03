const map = L.map('map', { 
    center: [38.246330, 21.734985], 
    zoom: 13
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);

//let marker = L.marker([38.237690, 21.726608]); 

//marker.addTo(map);