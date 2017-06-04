function initMap() {

  // create the map
  var geisel = {lat: 32.8811507, lng: -117.2396384};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: geisel,

  });
  // routeplan();
  // var input = document.getElementById('pac-input');
  // var autocomplete = new google.maps.places.Autocomplete(input);
  // autocomplete.addListener('place_changed', function(){
  //
  //   var place = autocomplete.getPlace();
  //   if (!place.geometry) {
  //     window.alert("No details for input");
  //     return;
  //   }
  //   if (place_list.length == 0) {
  //     var extended_bound = place.geometry.viewport;
  //   }
  //   else {
  //     var extended_bound = map.getBounds().extend(place.geometry.location);
  //   }
  //   // console.log(extended_bound);
  //   // set center and zoom
  //   // var extended_bound = map.getBounds().extend(place.geometry.location);
  //   // centerAndZoom(extended_bound);
  //   var $mapDiv = $('#map');
  //   var mapDim = {height: $mapDiv.height(), width: $mapDiv.width()};
  //   center = extended_bound.getCenter();
  //   map.setCenter(center);
  //   console.log("----------center------------");
  //   console.log(center);
  //   console.log(center.lat());
  //   console.log(center.lng());
  //   zoom = getBoundsZoomLevel(extended_bound, mapDim);
  //   map.setZoom(zoom);
  //   console.log("----------zoom------------");
  //   console.log(zoom);
  //   // clear the input field
  //   $(input).val('');
    // addPlaceInfo(place);
  // })
}

function addMarker(location, name, addr) {
  // console.log("*******location Below*******");
  // console.log(location);
  var infowindow = new google.maps.InfoWindow();
  var loc = location;
  var marker = new google.maps.Marker({
    position: loc,
    map: map,
    animation: google.maps.Animation.DROP
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
      name + '<br>' +
      addr + '</div>');
    infowindow.open(map, this);
  });
  google.maps.event.addListener(map, "click",   function(event) {
    infowindow.close();
  });
}
