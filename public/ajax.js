const map = L.map("map1");

const attrib = "Map data copyright OpenStreetMap contributors, Open Database Licence";

L.tileLayer
    ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: attrib }).addTo(map);

const pos = [50.90882, -1.40159];
map.setView(pos, 12);
var theMarker = {};

map.on("click", e => {
    if(theMarker != undefined){
        map.removeLayer(theMarker)
    };
    theMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    document.getElementById('lat').value = e.latlng.lat;
    document.getElementById('lon').value = e.latlng.lng;
    document.getElementById('newMarker').style.display = "block";
    document.getElementById('hide').addEventListener('click', () => {
        document.getElementById('newMarker').style.display = "none";
        map.removeLayer(theMarker);
    });
});

// adding a new Point of interest
async function addPoi() {
    const body = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        country: document.getElementById('country').value,
        region: document.getElementById('region').value,
        lat: document.getElementById('lat').value,
        lon: document.getElementById('lon').value,
        description: document.getElementById('description').value
    }
    const response = await fetch("/poi/poidb/create", { method: "POST", headers: { 'Content-type': 'application/json' }, body: JSON.stringify(body) });
};
document.getElementById('newPoi').addEventListener('click', () => {
    addPoi()
});

// adding a new review
async function addReview() {
    const id = document.getElementById('poi_id').value
    const reviewIn = document.getElementById('review').value
    console.log(id)
    console.log(reviewIn)
    const body = {
        poi_id: id,
        review: reviewIn
    }
    const response = await fetch("/poi/poidb/poi_reviews/addreview", { method: "POST", headers: { 'Content-type': 'application/json' }, body: JSON.stringify(body) });
};
document.getElementById('reviewBtn').addEventListener('click', () => {
    addReview()
});
async function addReviewId(id){
    document.getElementById('reviewDiv').style.display = "block";
    document.getElementById('poi_id').value = id;
};
document.getElementById('reviewBtn').addEventListener('click', () => {
    document.getElementById('reviewMessage').value = "Review has been Created";
});
document.getElementById('reviewCancel').addEventListener('click', () => {
    document.getElementById('reviewDiv').style.display = "none";
});

//recommend function
async function recommend(id, locationId) {
    await fetch(`http://localhost:3000/poi/poidb/${id}/recommend`, { method: 'POST' });
    console.log(locationId)
    //document.getElementById('message').innerHTML = "Thank you";  displaying even when not authorized
};



async function ajaxPoiRegionSearch(poiRegion) {
    const response = await fetch(`http://localhost:3000/poi/region/${poiRegion}`);
    const results = await response.json();
    // Looping through the array of JSON objects and adding the results to a <div>
    let html = "<table> <tr> <th>Name</th> <th>Type</th> <th>Country</th> <th>Region</th> <th>Description</th> <th>Recommendations</th> <th></th>";
    let locationId = 1;
    results.forEach(poi => {
        const result = poi.recommendations;
        const position = [poi.lat, poi.lon];
        const marker = L.marker(position).addTo(map);
        map.setView(position, 9);
        marker.bindPopup(`This is the town of ${poi.name}. It is ${poi.description} \n <button onclick="addReviewId(${poi.ID})" id="reviewBtn">Add a Review</button>`);
        html += `
        <tr>
        <td>${poi.name}</td>
        <td>${poi.type}</td>
        <td>${poi.country}</td>
        <td>${poi.region}</td>
        <td>${poi.description}</td>        
        <td id="location${locationId}">${result}</td>
        <td><button onclick="recommend(${poi.ID},location${locationId++})">Recommend</button></td>
        <td id="message" style="color: green;"></td>
        </tr>`
    });
    html += `</table>`;

    document.getElementById('results').innerHTML = html;
};
document.getElementById('ajaxButton').addEventListener('click', () => {
    const poiRegion = document.getElementById('poiRegion').value;
    ajaxPoiRegionSearch(poiRegion);
});


// Login/out functions
async function login() {
    const body = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    }
    const response = await fetch("/login", { method: "POST", headers: { 'Content-type': 'application/json' }, body: JSON.stringify(body) });

    const results = await response.json();
    if (results) {
        document.getElementById('loginBanner').innerHTML = `Logged in as ${results.username}`;
    } else {
        window.alert("could not log in")
    }
};
document.getElementById('loginBtn').addEventListener('click', () => {
    login(username, password);
    console.log(password + username);
});

async function logout() {
    const response = await fetch("/logout", { method: "POST" });
    if (response.status == 200) {
        const results = await response.json();
        console.log(results);
        document.getElementById('loginBanner').innerHTML = `You have been logged out`;
        document.getElementById('logoutBtn').style.display = "none";
    } else {
        window.alert("could not log out")
    }
};
document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});