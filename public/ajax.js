async function ajaxPoiRegionSearch(poiRegion) {
    const response = await fetch(`http://localhost:3000/poi/region/${poiRegion}`);
    const results = await response.json();
    // Loop through the array of JSON objects and add the results to a <div>
    let html = "<table> <tr> <th>Name</th> <th>Type</th> <th>Country</th> <th>Region</th> <th>Description</th> <th>Recommendations</th>";
    results.forEach(poi => {
        html += `
        <tr>
        <td>${poi.name}</td>
        <td>${poi.type}</td>
        <td>${poi.country}</td>
        <td>${poi.region}</td>
        <td>${poi.description}</td>
        <td>${poi.recommendations}</td>
        <td><button id="recommend">Recommend</button></td>
        </tr>`
    });
    html += `</table>`;
    document.getElementById('results').innerHTML = html;
};
// Make the AJAX run when we click a button
document.getElementById('ajaxButton').addEventListener('click', () => {
    // Read the product type from a text field
    const poiRegion = document.getElementById('poiRegion').value;
    ajaxPoiRegionSearch(poiRegion);
});