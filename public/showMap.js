const goodCampground = JSON.parse(CG);

let CampLocation= goodCampground.geometry.coordinates;
console.log(CampLocation)

mapboxgl.accessToken = mapToken  ;
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center:CampLocation, // starting position [lng, lat]
    zoom: 6 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(CampLocation)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${goodCampground.title}</h3>`
    )
)
.addTo(map)