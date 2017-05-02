var update = document.getElementById('update')

update.addEventListener('click', function(){

	//send PUT request here 
	fetch('trips',{
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			'trip': 'My Wild Night Out',
			'location': 'Las Vegas, NV.'
		})
	})

	fetch({ /* request */ })
	.then(res => 
		{
		  if (res.ok) return res.json()
		})
	.then(data => 
		{
		  console.log(data)
		  window.location.reload(true)
		})
})