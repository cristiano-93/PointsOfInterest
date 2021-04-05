 async function recommend(id, locationId) {
    await fetch(`http://localhost:3000/poi/poidb/${id}/recommend`, {method:'POST'});
    console.log(locationId)
    // const response = await fetch(`http://localhost:3000/poi/poidb/${id}`)
    // const result = await response.json();
    // console.log(result)
};

async function ajaxPoiRegionSearch(poiRegion) {
    const response = await fetch(`http://localhost:3000/poi/region/${poiRegion}`);
    const results = await response.json();
    // Looping through the array of JSON objects and adding the results to a <div>
    let html = "<table> <tr> <th>Name</th> <th>Type</th> <th>Country</th> <th>Region</th> <th>Description</th> <th>Recommendations</th>";
    let locationId = 1;
    results.forEach(poi => {
        const result = poi.recommendations;
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
//<td><button id="recommendBtn" onclick="recommend(${poi.ID})">Recommend</button></td>