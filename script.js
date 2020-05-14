// getting places from Json
function loadPlaces(position) {
    const endpoint = "https://raw.githubusercontent.com/tristanry/beyondthesea/gh-pages/europe.json";
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.elements;
                })
        })
        .catch((err) => {
            console.error('Error fetching places places', err);
        })
};

window.onload = () => {
    const scene = document.querySelector('a-scene');
    const defaultPosition = {
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
    return navigator.geolocation.getCurrentPosition(function (position) {
        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.lat;
                    const longitude = place.lon;

                    const tags = place.tags;


                    const placeText = document.createElement('a-text');

                    placeText.setAttribute('value', tags["name:fr"]);
                    placeText.setAttribute('look-at', "[gps-camera]");
                    placeText.setAttribute('scale', "12 12 12");
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);


                    const placeMaterial = document.createElement('a-box');
                    placeMaterial.setAttribute('material', "color: yellow");
                    placeMaterial.setAttribute('position', "0 30 0");
                    placeMaterial.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

                    placeMaterial.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeMaterial);


                });
            })
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );

};
