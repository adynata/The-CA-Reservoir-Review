$(document).ready(function(){
  $("#sta path").on("click", function() {
  	$(this).data("pin", !$(this).data("pin"))
  	if($(this).data("pin")){
    $(this).css("fill", "white");
}else{
	$(this).css("fill", "red");
}

var station_name = $(this)[0].__data__.properties.name
// console.log($('.multiSelect_station ul li input[value]'))
function check_dropdown() {
	$.each($('.multiSelect_station ul li input [value='']'), function(){
		if ($(this) === station_name){
		$(this).prop('checked', true)
	}})}
	
}

$("sta path").on("click", check_dropdown());
// if($(".input[type='checkbox']").val().innerText() === station_name){
// 	$(this).prop("checked")
// }
// // $('.multiSelect_station ul li').value(station_name).checked(true)

// console.log($("ul.multiSelect_station").val())
  $("#sta").on("click", function() {
    console.log($("#sta"));
    $('#sta > path').css("fill", "white");
    console.log(this);
  });




});
