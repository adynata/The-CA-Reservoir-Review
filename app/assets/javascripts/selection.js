$(document).ready(function(){
  $("#sta").on("click", function() {
    console.log($("#sta"));
    $('#sta > path').css("fill", "white");
    console.log(this);
  });

  $('.hydro-reg').on("click", function() {
    console.log(this);
    console.log(this.props);
  });




});
