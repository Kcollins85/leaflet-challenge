// create url query
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, the log the response in the console and send data.features object to the createFeatures function.
    console.log(data.features);
    createFeatures(data.features);
  });

//  set the marker colour options based on depth 
  function chooseColor(depth) {
    if (depth <= 10) 
    return "#FFFE9A";
    else if (depth <=25) 
    return "#F3A333";
    else if (depth <=50)
    return "#F16821";
    else if (depth <=75)
    return "#C70D3A";
    else if (depth <=100)
    return "#9D0B0B";
    else return "#000";
  }

  function createMarkers(feature, latlng) {

// Set marker options based on the magnitude
    let magnitude = feature.properties.mag;
    let markerOptions = {
      radius: magnitude * 4,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
  
    // Create the marker and bind a popup with the location, depth & magnitude
// how to i combine this with the layer function in oneachfeature?
    let marker = L.circleMarker(latlng, markerOptions);
    marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>depth:${feature.geometry.coordinates[2]}magnitude:${magnitude}</p>`);
  
    return marker;
  }

function createFeatures(earthquakeData) {

      // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>depth:${feature.geometry.coordinates[2]}<br>magnitude:${feature.properties.mag}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarkers
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

    function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        0, -0
      ],
      zoom: 2.5,
      layers: [street, earthquakes]
    });

      // Set up the legend.
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
        limits = [10, 25, 50, 75, 100];
        labels = [];
    
        for (var i = 0; i < limits.length; i++) {
          div.innerHTML +=
              '<i style="background:' + chooseColor(limits[i] + 1) + '"></i> ' +
              limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
      }
    return div;
    };

  // Adding the legend to the map
  legend.addTo(myMap);

      // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
  }