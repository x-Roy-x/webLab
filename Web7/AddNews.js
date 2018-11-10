window.onload = function(){ 
const text = document.getElementById('text');
const caption = document.getElementById('caption') 

const onSubmitPress = function(e){
  e.preventDefault();

  if (text.value.length == 0 && caption.value.length == 0) {
    alert("Невалідна новина") 
    return;
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