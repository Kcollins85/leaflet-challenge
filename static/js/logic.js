// create url constant URL
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
}