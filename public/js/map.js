    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/standard',
    center: listing.geometry.coordinates,
    zoom: 8 
    });
    
    const marker1 = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><P>Exact location will be provided after booking</p>` ))
    .addTo(map);

