
function loadJSON(callback) {
    //https://www.geekstrick.com/load-json-file-locally-using-pure-javascript/
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://raw.githubusercontent.com/tristanry/beyondthesea/gh-pages/europe.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

// getting places from JSON
function loadPlaces(position) {
    var venues = [];
    var countries = [];
    // Parsing JSON string into object
    loadJSON(function (response) {
        // Parsing JSON string into object
        countries = JSON.parse(response);
        console.log(countries);
        countries.elements.forEach(function (country, index) {
            venues.push({
                nodeid: country["id"],
                lat: country["lat"],
                lon: country["lon"],
                name: country["tags"]["name:fr"]
            }
            );
        });
        return venues;
    });
};


window.onload = () => {
    const scene = document.querySelector('a-scene');
    const position = {
        coords:
        {
            accuracy: 1,
            altitude: 1,
            altitudeAccuracy: 1,
            heading: null,
            latitude: 48.628895,
            longitude: -3.843934,
            speed: null
        }
    };
    loadPlaces(position.coords)
        .then(places) => {
        places.forEach((place) => {
            const latitude = place.lat;
            const longitude = place.lon;

            const placeText = document.createElement('a-text');

            placeText.setAttribute('value', place.name);
            placeText.setAttribute('look-at', "[gps-camera]");
            placeText.setAttribute('scale', "12 12 12");
            placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
            scene.appendChild(placeText);
        });
    };
};
