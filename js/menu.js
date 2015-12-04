function Menu() {
  var self = this;

  self.createItemMenu = function(obj, el) {
    $('.list-customers').append('<li><i class="glyphicon glyphicon-user"></i> ' + obj['Name'] + '</li>');
    var item = $('.list-customers li:last-child');
    $(el).addClass('active');
    $(el).find('.turnBut').click(function() {
      $(el).removeClass('active');
      $(item).addClass('no-active');
    });
    item.click(function() {
      if( !$(el).hasClass('active') ) {
        $(el).addClass('active');
        $(item).removeClass('no-active');
      };
    });

    return item;
  };

  self.removeItemMenu = function(item) {
    $(item).remove();
  }

};

var menu = new Menu();