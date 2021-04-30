const map = L.map("map");

const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

L.tileLayer
        ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: attrib } ).addTo(map);
         
const pos = [40.91842, -8.51741];
map.setView(pos, 14);

map.on("click", e => {
    L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
});