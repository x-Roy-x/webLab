window.onload = function(){ 
function isOnline() {
    return window.navigator.onLine;
}

console.log(isOnline());

var list_news = [];

const text = document.getElementById('text');
const caption = document.getElementById('caption') 
const photo = document.getElementById('formForFile')

const onSubmitPress = function(e){
  e.preventDefault();

  if (text.value.length == 0 && caption.value.length == 0) {
    alert("Невалідна новина") 
    return;
  }
  if(!isOnline()){
    var news = {
      name:caption.value,
      text:text.value,
      photo:photo.files[0].name
    }
    console.log(photo.files[0].name);
     
    list_news.push(news);

    localStorage.setItem("list_news",JSON.stringify(list_news));

    console.log(list_news);
  }else{
    console.log("Додається на сервер");
  }


  alert('Вашу новину успішно збережено!');
  
  text.value=" ";
  caption.value=" ";
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#example_picture').attr('src', e.target.result);                                                                                
      }                                                            
    

    reader.readAsDataURL(input.files[0]);
  }
}

$("#formForFile").change(function() {
  readURL(this);
});

const addButton = document.getElementById('sub');
addButton.onclick = onSubmitPress;
}