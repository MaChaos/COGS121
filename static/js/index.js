'use strict';

$(document).ready(function() {
  initializePage();
})
function initializePage() {
  sortable('.dests');
  // buttonclick();

}
function newDest() {
  var dest = document.getElementById("myInput").value;
  console.log(dest);
  document.getElementById("myInput").value = "";
  getAjax(dest);
}
function getAjax(query) {
  $.ajax({
         url: "http://api.mapbox.com/geocoding/v5/mapbox.places/"+query+".json?access_token=pk.eyJ1Ijoiemh1eW1hbyIsImEiOiJjajFvbjB2NTAwMTVtMzJtaGkwc2N1dW0zIn0.tNPQ9yER6BTqqrBaUi3T2A",
         type: "GET",
         crossDomain: true,
        // crossOrigin: true,
        //  data: JSON.stringify(somejson),
         dataType: "json",
         success: function (response) {
           console.log(response);
           var coordinates = response.features[0].geometry.coordinates;
           console.log(coordinates);

           addMarker(query, coordinates);
          //    var resp = JSON.parse(response);
          //    alert(resp.status);
         },
         error: function (xhr, status) {
             alert("error");
         }
     });
}
function addMarker(query, coordinates) {
  var newMarker = document.createElement('div');
  newMarker.id = query;
  newMarker.className = "newmarker";
  $("body").append(newMarker);

  var newli = document.createElement('li');
  newli.innerHTML = query;
  console.log(newli);
  $("#id_dest").append(newli);
  sortable('.dests');
  var marker = new mapboxgl.Marker(newMarker, {offset:[-25,0]})
  .setLngLat(coordinates)
  .setPopup(popup)
  .addTo(mapping);
  // var south = mapping.getSouth();
  // console.log(coordinates[0]);
  // var newllb = mapping.extend(coordinates);
  // console.log(coordinates.getSouth());
  var llb = mapping.getBounds().extend(coordinates);
  // mapping.jumpTo(llb);
  console.log(llb);
  console.log(llb.getSouth());
  // console.log(llb.getSouthWest());
  var bbox = [[llb.getWest(),llb.getSouth()],[llb.getEast(),llb.getNorth()]];
  console.log(bbox);
  mapping.fitBounds(bbox, {
  padding: {top: 10, bottom:25, left: 15, right: 5}
});

  // var line = {
  //   "type": "Feature",
  //   "properties": {
  //     "stroke": "#f00"
  //   },
  //   "geometry": {
  //     "type": "LineString",
  //     "coordinates": [
  //       [-117.213805, 32.870113],
  //       [-118.44, 34.076]
  //     ]
  //   }
  // };
  // var curved = turf.bezier(line);
  // var type = turf.bezier(line).type;
  // var geometry = turf.bezier(line).geometry;
  // var properties = turf.bezier(line).properties;
  // console.log(type);
  // console.log(curved);
  // var testdata = {
  //       "id": "route",
  //       "type": "line",
  //       "source": {
  //           "type": "geojson",
  //           "data": {
  //             type,
  //             geometry,
  //             properties
  //           }
  //       },
  //       "layout": {
  //           "line-join": "round",
  //           "line-cap": "round"
  //       },
  //       "paint": {
  //           "line-color": "#888",
  //           "line-width": 8
  //       }
  //   }
  //   console.log(testdata);
  // mapping.addLayer(testdata);

}
function buttonclick() {
  $('.submitdes').click(function(e) {
    // $.ajax({
    //        url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyAwKollJp_qMkAqlR2P43LxqtdGmVZFj9A",
    //        type: "GET",
    //       //  crossDomain: true,
    //       crossOrigin: true,
    //       //  data: JSON.stringify(somejson),
    //        dataType: "jsonp",
    //        success: function (response) {
    //          console.log(response);
    //         //    var resp = JSON.parse(response);
    //         //    alert(resp.status);
    //        },
    //        error: function (xhr, status) {
    //            alert("error");
    //        }
    //    });
    // $.ajax({
    //        url: "http://api.mapbox.com/geocoding/v5/mapbox.places/Irvine.json?access_token=pk.eyJ1Ijoiemh1eW1hbyIsImEiOiJjajFvbjB2NTAwMTVtMzJtaGkwc2N1dW0zIn0.tNPQ9yER6BTqqrBaUi3T2A",
    //        type: "GET",
    //        crossDomain: true,
    //       // crossOrigin: true,
    //       //  data: JSON.stringify(somejson),
    //        dataType: "json",
    //        success: function (response) {
    //          console.log(response);
    //          console.log(response.features[0].geometry.coordinates[0]);
    //         //    var resp = JSON.parse(response);
    //         //    alert(resp.status);
    //        },
    //        error: function (xhr, status) {
    //            alert("error");
    //        }
    //    });
  })
    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=AIzaSyAwKollJp_qMkAqlR2P43LxqtdGmVZFj9A");
    // xhr.onreadystatechange = function(){
    //   console.log(xhr.responseText);
    // }
    // xhr.send();
  // });
}
