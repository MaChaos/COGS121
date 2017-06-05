'use strict';
var place_list = [];
var map;
var activateMap = false;
$(document).ready(function() {
  $('.slider').click(function(){
    $('#map').toggleClass("hidden");
    $('.content-blog').toggleClass("hidden");
    // if (activateMap == false){
    //   initMap();
    // }
  });
  // $('#switch').click(function(){
  //   $('#map').toggleClass("hidden");
  // });
})
function initMap() {

  // create the map
  var geisel = {lat: 51.501364, lng: 0};
  map = new google.maps.Map(document.getElementById('myCarousel'), {
    zoom: 2,
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
  activateMap = true;
}

function addMarker(location, name, addr) {
  // if (place_list.length == 0) {
  //   var extended_bound = place.geometry.viewport;
  // }
  // else {
  //   var extended_bound = map.getBounds().extend(place.geometry.location);
  // }

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
