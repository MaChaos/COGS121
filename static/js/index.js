'use strict';

$(document).ready(function() {
  initializePage();
})
var map;
var center;
var zoom;
var marker;
var place_list = [];
var geo_list = [];
function initializePage() {
  // console.log(document.getElementById('blog-id').innerHTML);
}
function setPlaceList(place) {
  place_list.push(place);
  // console.log(place_list);
}
function routeplan() {
  var origin_auto = new google.maps.places.Autocomplete(document.getElementById('origin_0'));
  origin_auto.addListener('place_changed', function(){
    var origin = origin_auto.getPlace();
    if (!origin.geometry) {
      window.alert("No details for input");
      return;
    }
    console.log(origin);
  });
  var destination_auto = new google.maps.places.Autocomplete(document.getElementById('dest_0'));
  destination_auto.addListener('place_changed', function(){
    var destination = destination_auto.getPlace();
    if (!destination.geometry) {
      window.alert("No details for input");
      return;
    }
    console.log(destination);
  });
  // console.log(origin);
  // console.log(destination);
}
// use Google Maps API to create a mapbox
function initMap() {

  // create the map
  var geisel = {lat: 32.8811507, lng: -117.2396384};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: geisel,
    styles: [
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#7fc8ed"
            },
            {
                "saturation": 55
            },
            {
                "lightness": -6
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#7fc8ed"
            },
            {
                "saturation": 55
            },
            {
                "lightness": -6
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#83cead"
            },
            {
                "saturation": 1
            },
            {
                "lightness": -15
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#f3f4f4"
            },
            {
                "saturation": -84
            },
            {
                "lightness": 59
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffffff"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "hue": "#bbbbbb"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 26
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffcc00"
            },
            {
                "saturation": 100
            },
            {
                "lightness": -35
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffcc00"
            },
            {
                "saturation": 100
            },
            {
                "lightness": -22
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#d7e4e4"
            },
            {
                "saturation": -60
            },
            {
                "lightness": 23
            },
            {
                "visibility": "on"
            }
        ]
    }
]
  });
  // routeplan();
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function(){

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details for input");
      return;
    }
    if (place_list.length == 0) {
      var extended_bound = place.geometry.viewport;
    }
    else {
      var extended_bound = map.getBounds().extend(place.geometry.location);
    }
    // console.log(extended_bound);
    // set center and zoom
    // var extended_bound = map.getBounds().extend(place.geometry.location);
    // centerAndZoom(extended_bound);
    var $mapDiv = $('#map');
    var mapDim = {height: $mapDiv.height(), width: $mapDiv.width()};
    center = extended_bound.getCenter();
    map.setCenter(center);
    console.log("----------center------------");
    console.log(center);
    console.log(center.lat());
    console.log(center.lng());
    zoom = getBoundsZoomLevel(extended_bound, mapDim);
    map.setZoom(zoom);
    console.log("----------zoom------------");
    console.log(zoom);
    // clear the input field
    $(input).val('');
    addPlaceInfo(place);
  })
}

function uploadPlacesToDb() {
  $.post("/post",
    {
      places: place_list,
      title: $('#blog-title').val(),
      content: $('#blog-content').val(),
      coverURL: $('#first-slide').attr('src'),
      zoomLevel: zoom,
      centerLatLng: {
        lat: center.lat(),
        lng: center.lng()
      }
    },
    function(data, status) {
      if (status == 'success') {
        window.location = data.redirect;
      }
    }
  )
}

function save() {
  $.post("/save",
    {
      // id: document.getElementById('blog-id').innerHTML,
      places: place_list,
      title: $('#blog-title').val(),
      content: $('#blog-content').val(),
      coverURL: $('#first-slide').attr('src'),
      zoomLevel: zoom,
      centerLatLng: {
        lat: center.lat(),
        lng: center.lng()
      }
    },
    function(data, status) {
      if (status == 'success') {
        console.log(data.redirect);
        window.location = data.redirect;
      }
    }
  )
}

//Adds a marker to the map
function addMarker(location, name, addr) {
  // console.log("*******location Below*******");
  // console.log(location);
  var infowindow = new google.maps.InfoWindow();
  // var loc = location;
  marker = new google.maps.Marker({
    position: location,
    map: map,
    animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + name + '</strong><br>' +
      addr + '</div>');
    infowindow.open(map, this);
  });
  google.maps.event.addListener(map, "click",   function(event) {
    infowindow.close();
  });
}

////////////// addPlaceInfo ///////////////////
function addPlaceInfo(place) {
  var place_info = document.createElement('div');
  place_info.className = "place-info";
  var address = place.formatted_address;
  // add icon
  var place_icon = document.createElement('img');
  place_icon.src = place.icon;
  place_icon.className = "place-icon"
  place_info.append(place_icon);

  // add place name
  var place_name = document.createElement('span');
  place_name.textContent = place.name;
  place_name.className = "place-name"
  place_info.append(place_name);
  place_info.append(document.createElement('br'));

  // add place address
  var place_addr = document.createElement('span');
  place_addr.textContent = address;
  place_addr.className = "place-address"
  place_info.append(place_addr);

  var latlng = {
    lat : place.geometry.location.lat(),
    lng : place.geometry.location.lng()
  }
  geo_list.push(latlng);
  var newli = document.createElement('li');
  newli.append(place_info);
  $("#place-cards").append(newli);
  // $('#blog-content').append(newli);
  var place_cards = document.getElementById('place-cards');


  ////////////// add Sortable ///////////////////
  var editablePlace = Sortable.create(place_cards, {
    onUpdate: function(evt) {
      var item = evt.item;
      // console.log("item: " + item);
    },
    onEnd: function(evt){
      // console.log(evt.oldIndex);
    },
    dataIdAttr: 'data-id'
  });
  ////////////// create place_list(db) ///////////////////
  var elements = document.getElementById('place-cards').children;
  // place_list = [];
  var temp = {
    'name': place.name,
    'addr': address,
    'geo': latlng
  }
  place_list.push(temp);
  console.log(place_list);
  // for (var i = 0; i < elements.length; i++) {
  //   var temp1 = elements[i];
  //   var temp2 = {
  //     'addr': temp1.getElementsByClassName('place-address')[0].innerHTML,
  //     'geo': geo_list[i]
  //   };
  //   place_list.push(temp2);
  //   console.log(place_list);
  // }
  addMarker(place.geometry.location, place.name, address);
  ////////////// add Route ///////////////////
  // var length = place_list.length;
  // if (length == 1)
  //   addMarker(place.geometry.location,map);
  // else if (length == 2) {
  //   marker.setMap(null);
  //   addRoute(place_list, length);
  // }
  // else if (length > 2)
  //   addRoute(place_list, length);
  // console.log("place-list: "+ place_list);
}
function addPlaceList(name, addr) {
  var place_info = document.createElement('div');
  place_info.className = "place-info";
  // var address = addr;
  // add icon
  // var place_icon = document.createElement('img');
  // place_icon.src = place.icon;
  // place_icon.className = "place-icon"
  // place_info.append(place_icon);

  // add place name
  var place_name = document.createElement('span');
  place_name.textContent = name;
  place_name.className = "place-name"
  place_info.append(place_name);
  place_info.append(document.createElement('br'));

  // add place address
  var place_addr = document.createElement('span');
  place_addr.textContent = addr;
  place_addr.className = "place-address"
  place_info.append(place_addr);

  var newli = document.createElement('li');
  newli.append(place_info);
  $("#place-cards").append(newli);

  // for (var i = 0; i < elements.length; i++) {
  //   var temp1 = elements[i];
  //   var temp2 = {
  //     'addr': temp1.getElementsByClassName('place-address')[0].innerHTML,
  //     'geo': geo_list[i]
  //   };
  //   place_list.push(temp2);
  //   console.log(place_list);
  // }
  // addMarker(place.geometry.location, place.name, address);
  ////////////// add Route ///////////////////
  // var length = place_list.length;
  // if (length == 1)
  //   addMarker(place.geometry.location,map);
  // else if (length == 2) {
  //   marker.setMap(null);
  //   addRoute(place_list, length);
  // }
  // else if (length > 2)
  //   addRoute(place_list, length);
  // console.log("place-list: "+ place_list);
}
////////////// func addRoute ///////////////////
// function addRoute(place_list, length) {
//   var directionsService = new google.maps.DirectionsService;
//   var directionsDisplay = new google.maps.DirectionsRenderer;
//   directionsDisplay.setMap(map);
//
//   var origin = place_list[0].addr;
//   var destination = place_list[place_list.length - 1].addr;
//   var waypoints = [];
//   var format;
//
//   // if more than 2 destinations, then add waypoints from place_list
//   if (length > 2) {
//     for (var i = 1; i < length - 1; i++) {
//       waypoints.push({
//         location: place_list[i].addr
//       });
//     }
//     console.log(waypoints);
//     displayRoute(origin, destination, waypoints, directionsService, directionsDisplay);
//   }
//   // only two destinations
//   else {
//     displayRoute(origin, destination, waypoints, directionsService, directionsDisplay);
//   }
// }
//
// function displayRoute(origin, destination, waypoints, service, display) {
//   service.route({
//     origin: origin,
//     destination: destination,
//     waypoints: waypoints,
//     travelMode: 'DRIVING',
//     avoidTolls: true
//   }, function(response, status) {
//     if (status === 'OK') {
//       display.setDirections(response);
//     } else {
//       alert('Could not display directions due to: ' + status);
//     }
//   });
// }

function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

function uploadImage(){
  $('#cover-image').submit((e) => {
  e.preventDefault();
  const data = new FormData(document.querySelector('form'));
  // console.log(data);
  $.ajax({
    url: '/uploadImg',
    type: 'POST',
    contentType: false,
    data: data,
    enctype: 'multipart/form-data',
    processData: false,
    success: function (res) {
      console.log("success");
      var tempPath = "/uploads/" + res.filename;
      $("#first-slide").attr("src", tempPath);
      // $('#response').text(res.message);
    }
  });
});
}
// function highlight() {
//   $(window).scroll(function(){
//     var height = $(".highlight").offset().top - $(window).scrollTop();
//     // console.log(height);
//     $("#log").html("position: " + height + "\n marker Color: " + $("#newmarker").css("background-color") + "HighColor: " + $("highlight").css("color"));
//     if (height < 100) {
//       // console.log(height);
//
//       $("#newmarker").css("background-color", $("#highlight").css("color"));
//     }
//   })
// }
