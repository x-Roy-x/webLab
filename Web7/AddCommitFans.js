const feedback = (name, text, date, time) => ` 
    <div class="border">
		<p>${text}</p>
		<p class="name">${name}</p><p>${date}, ${time}</p>
	</div>
`

function addElement(){
	if (document.getElementById('inp').value.length == 0 && document.getElementById('name').value.length == 0){ 
		alert("Невалідна новина") 
		return;
	}

	const date = new Date();
	
	$('#con').prepend(
    	feedback(document.getElementById('name').value, document.getElementById('inp').value, date.toLocaleDateString(), date.toLocaleTimeString())
  	);
	document.getElementById('name').value = '';
  	document.getElementById('inp').value = '';
}