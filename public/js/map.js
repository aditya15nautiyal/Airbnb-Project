// console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.1025, 28.7041], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
//NOTE: CHECK THE STYLE.CSS PAGE, WHICH GIVES THE MAP A HEIGHT AND WIDTH
