const feedback = (name, text, date, time) => ` 
    <div class="border">
		<p>${text}</p>
		<p class="name">${name}</p><p>${date}, ${time}</p>
	</div>
`

function isOnline() {
    return window.navigator.onLine;
}

var list_commit = [];

function addElement(){
	if (document.getElementById('inp').value.length == 0 && document.getElementById('name').value.length == 0){ 
		alert("Невалідна новина") 
		return;
	}

	const date = new Date();
	if(!isOnline()){
	    var commit = {
	      name:document.getElementById('name').value,
	      text: document.getElementById('inp').value
	    }
    
    	list_commit.push(commit);

    	localStorage.setItem("list_commit",JSON.stringify(list_commit));

    	console.log(list_commit);
  	}if(isOnline()){
    	console.log("Додається на сервер");
    	$('#con').prepend(
    	feedback(document.getElementById('name').value, document.getElementById('inp').value, date.toLocaleDateString(), date.toLocaleTimeString())
  		);
  	}
	
	
	document.getElementById('name').value = '';
  	document.getElementById('inp').value = '';
}
function addElementLocalStorig(){
	const date = new Date();
	if(isOnline()){
		for(var i = 0; i < JSON.parse(localStorage.getItem("list_commit")).length ;i++){
			$('#con').prepend(
		    	feedback(JSON.parse(localStorage.getItem("list_commit"))[i].name,
		    		JSON.parse(localStorage.getItem("list_commit"))[i].text,
		    		date.toLocaleDateString(), date.toLocaleTimeString())
		  	);
		}
	}
}