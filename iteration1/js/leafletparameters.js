var map = L.map('map', {
		center: [32.842674, -117.25767], //controlled lat, long
		zoom: 15
	});
   
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map)