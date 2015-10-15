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

;(function($, window, document, undefined) {

  'use strict';

	var $html = $('html');

  $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown', function(e) {
    e.preventDefault();
    $(this).toggleClass('is-open');
  });

  $html.on('click.ui.dropdown tap.ui.dropdown', '.js-dropdown [data-dropdown-value]', function(e) {
    e.preventDefault();
    var $self = $(this);
    var $dropdown = $self.parents('.js-dropdown');
    $dropdown.find('.js-dropdown__input').val($self.data('dropdown-value'));
    $dropdown.find('.js-dropdown__current').text($self.text());
  });

  $html.on('click.ui.dropdown tap.ui.dropdown', function(e) {
    var $target = $(e.target);
    if (!$target.parents().hasClass('js-dropdown')) {
      $('.js-dropdown').removeClass('is-open');
    }
  });

})(jQuery, window, document);
//
// obj.dd.on('click', function(event){
//   $(this).toggleClass('active');
//   return false;
// });

//...

// $(function() {

  // var dd = new DropDown( $('#dd') );
  //
  // $(document).click(function() {
  //   // all dropdowns
  //   $('.wrapper-dropdown').removeClass('active');
  // });

// });
//
// function DropDown(el) {
//     this.dd = el;
//     this.placeholder = this.dd.children('span');
//     this.opts = this.dd.find('ul.dropdown > li');
//     this.val = '';
//     this.index = -1;
//     this.initEvents();
// }
// DropDown.prototype = {
//     initEvents : function() {
//         var obj = this;
//
//         obj.dd.on('click', function(event){
//             $(this).toggleClass('active');
//             return false;
//         });
//
//         obj.opts.on('click',function(){
//             var opt = $(this);
//             obj.val = opt.text();
//             obj.index = opt.index();
//             obj.placeholder.text('Gender: ' + obj.val);
//         });
//     },
//     getValue : function() {
//         return this.val;
//     },
//     getIndex : function() {
//         return this.index;
//     }
// }
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
