$(document).ready(function(){

$(".dropdown_hydro dt a").on('click', function(e) {
  e.stopImmediatePropagation();

  $(".dropdown_hydro dd ul").slideToggle('fast');
});

$(".dropdown_hydro dd ul li a").on('click', function(e) {
  e.stopImmediatePropagation();

  $(".dropdown_hydro dd ul").hide();
});

$(".dropdown_station dt a").on('click', function(e) {
  e.stopImmediatePropagation();

  $(".dropdown_station dd ul").slideToggle('fast');
});

$(".dropdown_station dd ul li a").on('click', function(e) {
  e.stopImmediatePropagation();
});


obj.dd.on('click', function(event){
  $(this).toggleClass('active');
  return false;
});

//...

// $(function() {

  var dd = new DropDown( $('#dd') );

  $(document).click(function() {
    // all dropdowns
    $('.wrapper-dropdown').removeClass('active');
  });

// });
//
function DropDown(el) {
    this.dd = el;
    this.placeholder = this.dd.children('span');
    this.opts = this.dd.find('ul.dropdown > li');
    this.val = '';
    this.index = -1;
    this.initEvents();
}
DropDown.prototype = {
    initEvents : function() {
        var obj = this;

        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            return false;
        });

        obj.opts.on('click',function(){
            var opt = $(this);
            obj.val = opt.text();
            obj.index = opt.index();
            obj.placeholder.text('Gender: ' + obj.val);
        });
    },
    getValue : function() {
        return this.val;
    },
    getIndex : function() {
        return this.index;
    }
}
// function getSelectedValue(id) {
//   return $("#" + id).find("dt a span.value").html();
// }

// $(document).bind('click', function(e) {
//   var $clicked = $(e.target);
//   if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
// });

// $('.mutliSelect input[type="checkbox"]').on('click', function() {

//   var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
//     title = $(this).val() + ",";

//   if ($(this).is(':checked')) {
//     var html = '<span title="' + title + '">' + title + '</span>';
//     $('.multiSel').append(html);
//     $(".hide").hide();
//   } else {
//     $('span[title="' + title + '"]').remove();
//     var ret = $(".hide");
//     $('.dropdown dt a').append(ret);

//   }
// });
})
