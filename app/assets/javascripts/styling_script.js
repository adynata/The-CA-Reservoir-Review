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

  $(".dropdown_station dd ul").hide();
});

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
