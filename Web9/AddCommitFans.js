var useLocalStorage = false;

const feedbackAdd = (name, text, time) => ` 
    <div class="border">
		<p>${text}</p>
		<p class="name">${name}</p><p>${time}</p>
	</div>
`

class Feedback{
	constructor(name, feedback, date){
		this.name = name;
		this.feedback = feedback;
		this.date = date;
	}
}

function addToStorage(feedback){
  if(useLocalStorage){
      var feedbackItem = localStorage.getItem('feedbacks');
      if (feedbackItem !== null) {
          feedbacks = JSON.parse(feedbackItem);
        }
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    return false;
  }
  else{
    var openDB = indexedDB.open("feedback", 1);

    openDB.onerror = function(event){
      alert("Error when adding feedback to DataBase")
    };
    openDB.onsuccess = function(event){
      var db = openDB.result;
      var trans = db.transaction(["feedbacks"], "readwrite");
      var store = trans.objectStore("feedbacks");
      var addFeedback = store.put(feedback);
      addFeedback.onsuccess = function(event){
        alert("Feedback added");
      }
      addFeedback.onerror = function(event){
        alert("Error when adding Feedback")
      }
      trans.oncomplete = function(){
        db.close();
      }
    };
  }
}


function show(){
	  if(useLocalStorage){
	      var feedbackItem = localStorage.getItem('feedbacks');
	      if (feedbackItem !== null) {
	          feedbacks = JSON.parse(feedbackItem);
	        }
	    if ((typeof feedbacks !== 'undefined') && (feedbacks.length > 0)) {
	      for(var i = 0; i < feedbacks.length; i++) {
	        createFeedback(feedbacks[i]);
	      }
	    }
	  }
	  else{
		    var openDB = indexedDB.open("feedback", 1);
		    openDB.onupgradeneeded = function() {
		      var db = openDB.result;
		      var store = db.createObjectStore("feedbacks", {keyPath: "name"});
		      store.createIndex("name", "name", {unique: false});
		      store.createIndex("feedback", "feedback", {unique: false});
		      store.createIndex("date", "date", {unique: false});
		    }
		    openDB.onsuccess = function(event){
		      var db = openDB.result;
		      var trans = db.transaction("feedbacks", "readwrite");
		    var store = trans.objectStore("feedbacks");
		    store.openCursor().onsuccess = function(event){
		        var cursor = event.target.result;
		        if (cursor) {
		          var tempFeed = new Feedback(cursor.value.name, cursor.value.feedback, cursor.value.date);
		          createFeedback(tempFeed);
		          //var request = db.transaction(["feedbacks"], "readwrite").objectStore("feedbacks").delete(cursor.primaryKey);
		          cursor.continue();
		      }
		    }
		    trans.oncomplete = function(){
		      db.close();
		    }
    	}
  	}
}

function addFeedback(){
  var comment = document.getElementById("inp");
  var name = document.getElementById("name");
  var date = new Date();
  dateString = date.toLocaleDateString()+ "/" + date.toLocaleTimeString();
  if(name.value == ""){
    alert("Введіть ім'я!");
    return;
  }
  if(comment.value == ""){
    alert("Введіть відгук!");
    return;
  }
  var feedback = new Feedback(name.value, comment.value, dateString);
  addToStorage(feedback);
  createFeedback(feedback);
  name.value = "";
  comment.value = "";
}

function createFeedback(feedback){
  $('#con').prepend(feedbackAdd(feedback.feedback,feedback.name,feedback.date));
}
show();
