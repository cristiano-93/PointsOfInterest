const map = L.map("map1");

const attrib = "Map data copyright OpenStreetMap contributors, Open Database Licence";

L.tileLayer
    ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: attrib }).addTo(map);

const pos = [40.91842, -8.51741];
map.setView(pos, 14);
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





async function recommend(id, locationId) {
    await fetch(`http://localhost:3000/poi/poidb/${id}/recommend`, { method: 'POST' });
    console.log(locationId)
};

async function ajaxPoiRegionSearch(poiRegion) {
    const response = await fetch(`http://localhost:3000/poi/region/${poiRegion}`);
    const results = await response.json();
    // Looping through the array of JSON objects and adding the results to a <div>
    let html = "<table> <tr> <th>Name</th> <th>Type</th> <th>Country</th> <th>Region</th> <th>Description</th> <th>Recommendations</th>";
    let locationId = 1;
    results.forEach(poi => {
        const result = poi.recommendations;
        const position = [poi.lat, poi.lon];
        const marker = L.marker(position).addTo(map);
        map.setView(position, 6);
        marker.bindPopup(`This is the town of ${poi.name}. It is ${poi.description}`);
        html += `
        <tr>
        <td>${poi.name}</td>
        <td>${poi.type}</td>
        <td>${poi.country}</td>
        <td>${poi.region}</td>
        <td>${poi.description}</td>        
        <td id="location${locationId}">${result}</td>
        <td ><button onclick="recommend(${poi.ID},location${locationId++})">Recommend</button></td>
        </tr>`
    });
    html += `</table>`;

    document.getElementById('results').innerHTML = html;
};
document.getElementById('ajaxButton').addEventListener('click', () => {
    const poiRegion = document.getElementById('poiRegion').value;
    ajaxPoiRegionSearch(poiRegion);
});

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
        // document.getElementById('message').style.display = "none";
        // document.getElementById('loginForm').style.display="block";
    } else {
        window.alert("could not log out")
    }
};
document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});