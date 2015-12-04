function Card(){
  var self = this;

  self._massCards = JSON.parse(getData()); 

  function getData() {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', 'data.json', false);
    xhr.send();

    return xhr.responseText
  };

  function sendData() {
    var xhr = new XMLHttpRequest();
    
    var data = JSON.stringify(self._massCards);
    xhr.open('POST', '/form', true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.send(data);
  };

  self.createCard = function() {
    var obj = this;
    var tmp = $('.tmp').clone().removeClass('tmp');

    $('.main').append(tmp);

    for (var key in obj) {
      $(tmp).find('.' + key).append(obj[key]);
    };

    var item = self.createItemMenu(obj, tmp);

    $(tmp).find('.removeBut').click(function() {
      self.removeCard(this,item);
    });
    $(tmp).find('.editBut').click(self.editCard);
  };

  self.removeCard = function(card, item) {

    if( !(confirm("Удалить безвозвратно?")) ) return;

    self.removeItemMenu(item);

    var obj = $(card).closest('.card');
    $(obj).remove();
    var telephone = $(obj).find('.Telephone').text();
   
    for (var i = 0; i < self._massCards.length; i++) {
      if (self._massCards[i]['Telephone'] == telephone) {     // использую телефон как индентификатор  
        self._massCards.splice(i, 1);
      };
    };
    sendData();
  };

  self.addCard = function() {
    var objData = createObjForm();
   
    if (objData) {
      self._massCards.push(objData);
      var card = new Customers(objData);
      card.createCard();
    };
    sendData();
  };

  $('.addBut').click(self.addCard)

  var dataEdit = {};
  var posEdit = 0;
  var objEdit ;

  self.editCard = function() {
    objEdit = $(this).closest('.card');
    var massField = $(objEdit).find('li');
    var massInput = $('#modal-edit .form-group div.input-group input');
    dataEdit = {};
    posEdit = 0;

    for(var i = 0; i < massField.length; i++) {
      var value = $(massField[i]).html();
      var key = $(massInput[i]).attr('name');

      dataEdit[key] = value;

      $(massInput[i]).val(value);
    };

    posEdit = indexOfObj(dataEdit);
  };


  function makeСhanges() {

    var massI = $('#modal-edit .form-group div.input-group input');
    var chObj = {};
    
    for (var i = 0; i < massI.length; i++){
      var value = massI[i].value;
      var key = massI[i].name;
      console.log(value)
      if (value) {
        chObj[key] = value;
      } else {
        alert('Не заполнено поле ' + key );
        break;
      }
    };

    if(checkTel(chObj) - 1 !== posEdit && checkTel(chObj)) {
      alert('Пользователь с таким телефоном уже существует');
      return
    };

    if(dataEdit == chObj) return;

    for (var key in chObj) {
      self._massCards[posEdit][key] = chObj[key];
      $(objEdit).find('li.' + key).html(chObj[key]);
    };
    sendData();
  };

  $('.edit').click(makeСhanges)

  function createObjForm() {
    var obj = {};
    var massInput = $('#modal-add .form-group div.input-group input');
    
    for(var i = 0; i < massInput.length; i++){

      var key = massInput[i].name;

      var value = $(massInput[i]).val();
      if (value) {
        obj[key] = value;
        obj[length] = i + 1;
      } else {
        alert('Не заполнено поле ' + key );
        break
      };
    };

    if(checkTel(obj)){
      alert('Пользователь с таким телефоном уже существует');
      obj[length]--
    };
    
    if (obj[length] == 8) {
      delete obj[length];
      cleanField(massInput);
      return obj 
    } else {
      return null
    };
  };

  function cleanField(el){
    for (var x = 0; x < el.length; x++) {
      el[x].value = null;
    };
  };

  function checkTel(obj) {
    for(var y = 0; y < self._massCards.length; y++){
      if(self._massCards[y]['Telephone'] == obj['Telephone']) {
        return y + 1;
      };
    };
    return 0;
  };

  function indexOfObj(obj) {
    var pos = checkTel(obj) - 1;
    return pos;
  };
};

Card.prototype = menu;

var card = new Card();

function Customers(objData) {
  for (var key in objData) {
    this[key] = objData[key];
  };
};

Customers.prototype = card;

function createCards() {
  for (var i = 0; i < card._massCards.length; i++) {
    var customer = new Customers(card._massCards[i]);
    customer.createCard();
  }
};

$(window).ready(function() {
  createCards();
});