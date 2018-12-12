var useLocalStorage = false;

function isOnline() {
  return window.navigator.onLine;
}

const feedback = (name, text,photo) => ` 
    <div class="col-lg-3">
		<img src=${photo} style="height:25%;width: 100%;">
		<h3>${name}</h3>
		<p>${text}</p>
	</div>
`

class News{
  constructor(title, desc, image){
    this.title = title;
    this.desc = desc;
    this.image = image;
  }
}

function getNews() {
    var news = new Array;
    var news_item = localStorage.getItem('news');
    if (news_item !== null) {
        news = JSON.parse(news_item);
    }
    return news;
}

function addNews(){
  
  var imageForm = document.getElementById("userInputFile");
  var title = document.getElementById("title");
  var desc = document.getElementById("description");
  var image = document.getElementById("user-image");
  if (title.value == ""){
    alert("Введіть заголовок!");
    return;
  }
  if (desc.value == ""){
    alert("Введіть опис статті!");
    return;
  }
  var news = new News(title.value, desc.value, image.src);
  if(isOnline()){
    sendNewsToServer(news);
  }else{
    addToStorage(news);
  }
  
  title.value = "";
  desc.value = "";
  imageForm.value = "";
}

function addToStorage(newsItem){
    if(useLocalStorage){
       var news = getNews();
       news.push(newsItem);
       localStorage.setItem('news', JSON.stringify(news));
       return false;
    }
    else {
      var openDB = indexedDB.open("news", 1);

      openDB.onupgradeneeded = function() {
        var db = openDB.result;
        var store = db.createObjectStore("news", {keyPath: "title"});
        store.createIndex("title", "title", {unique: false});
        store.createIndex("desc", "desc", {unique: false});
        store.createIndex("image", "image", {unique: false});
      };
      openDB.onerror = function(event) {
        alert("Error when adding feedback to DataBase");
      };

      openDB.onsuccess = function(event) {
        var db = openDB.result;
        var trans = db.transaction(["news"], "readwrite");
        var store = trans.objectStore("news");
        var add = store.put(newsItem);
        add.onsuccess = function(event){
          alert("News added");
        }
        add.onerror = function(event){
          alert("Error when adding Feedback");
        }
        trans.oncomplete = function(){
          db.close();
        }
    }

  }
}

function loadPreviewPhoto(){
  var src = document.getElementById("userInputFile");
  var target = document.getElementById("user-image");
  var fr = new FileReader();
  fr.readAsDataURL(src.files[0]);
  fr.onload = function(e){
      target.src = this.result;
  };
}

function createNews(news){
	$("#news").prepend(feedback(news.title,news.desc,news.image));
}

function show(){
  if(isOnline()){
    getNewsFromServer();
  }else{
  	if(useLocalStorage){
		var news = new Array;
	    var news_item = localStorage.getItem('news');
	    if (news_item !== null) {
	        news = JSON.parse(news_item);
	    }
	    if ((typeof news !== 'undefined') && (news.length > 0)) {
		    for(var i = 0; i < news.length; i++) {
	    		createNews(news[i]);
		    }
		}
  
	}else{
		var openDB = indexedDB.open("news", 1);
		openDB.onupgradeneeded = function(){
		    var db = openDB.result;
		    var store = db.createObjectStore("news", {keyPath: "title"});
		    store.createIndex("title", "title", {unique: false});
		    store.createIndex("desc", "desc", {unique: false});
		    store.createIndex("image", "image", {unique: false});
		}
		openDB.onsuccess = function(event){
		    var db = openDB.result;
		    var trans = db.transaction("news", "readwrite");
		    var store = trans.objectStore("news");
		    store.openCursor().onsuccess = function(event){
		       	var cursor = event.target.result;
		       	if (cursor){
		         	var tempNews = new News (cursor.value.title, cursor.value.desc, cursor.value.image);
		         	createNews(tempNews);
		         	var request = db.transaction(["news"], "readwrite").objectStore("news").delete(cursor.primaryKey);
		         	cursor.continue();
		       	}
		   	};
			trans.oncomplete = function(){
		    	db.close();
			}
		}
  }
}
}

show();

function sendNewsToServer(data) {
  let url = 'http://localhost:3012/News';

  postRequest(url, data)
      .then(data => console.log(data))
      .catch(error => console.error(error));

  function postRequest(url, data) {
      return fetch(url, {
          credentials: 'same-origin',
          method: 'POST',
          body: JSON.stringify(data),
          headers: new Headers({
              'Content-Type': 'application/json'
          }),
      })
  .then(response => response.json())
  }
}

function getNewsFromServer() {
  let url = 'http://localhost:3012/News';
  fetch(url)
      .then(response => response.json())
      .then(data => {
          for (i in data) {
            createNews(data[i]);
          }
      })
      .catch(error => console.error(error));
}