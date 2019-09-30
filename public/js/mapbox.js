/* eslint-disable */
document.addEventListener('DOMContentLoaded', function() {
    const locations = JSON.parse(document.getElementById('map').dataset.locations);

    mapboxgl.accessToken =
        'pk.eyJ1IjoiYWxpcmFtYXpvbiIsImEiOiJjazE1eHExbDcwZjRhM2NzNTk1bjUzZW9hIn0.A0xgHwba0L1d6er7EBy9vA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/aliramazon/ck15xw96c3d4e1cp7r8pv6cdj',
        scrollZoom: false
        // center: [-118.2437, 34.0522],
        // zoom: 20
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';
        // el.innerText = loc.description;

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup

        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
});
