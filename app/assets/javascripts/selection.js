$(document).ready(function(){
  // $("#sta path").on("click", function() {
  //   console.log($(this).data)
  // 	$(this).data("pin", !$(this).data("pin"))
  //
  // 	if ($(this).data("pin")) {
  //     $(this).css("fill", "white");
  //   } else {
  // 	$(this).css("fill", "red");
  //   });

  // $(".station").on("click", function(e) {
  //   e.stopImmediatePropagation();
  //   console.log($(this)[0].__data__.properties.name);
  //   console.log($(this)[0].__data__.properties.id);
  //   var station = $(this)[0].__data__.properties.id;
  //   if ($(this).attr("class") === "station") {
  //     $('.clicked_sta').attr("class", "station");
  //     $('.station').css("fill", "orange");
  //     $(this).attr("class", "station clicked_sta");
  //     $(this).css("fill", "lightblue");
  //   } else {
  //     $(this).attr("class", "station");
  //     $(this).css("fill", "orange")
  //   }
  //   console.log(document.getElementsByClassName('clicked_sta'));
  //
  // });


  // $('.hydro-reg').on("click", function() {
  //   console.log(this);
  //   console.log(this.props);
  // });

  // var station_name = $(this)[0].__data__.properties.name
  // console.log($('.multiSelect_station ul li input[value]'))
  // function check_dropdown() {
  // $.each($('.multiSelect_station ul li input [value='']'), function(){
  //   if ($(this) === station_name){
  //   $(this).prop('checked', true);
  //  }
  // });
  // }
  // $("sta path").on("click", check_dropdown());
  // if($(".input[type='checkbox']").val().innerText() === station_name){
  // 	$(this).prop("checked")
  // }

  // $('.multiSelect_station ul li').value(station_name).checked(true)
  //
  //   console.log($("ul.multiSelect_station").val())
  //   $("#sta").on("click", function() {
  //     console.log($("#sta"));
  //     $('#sta > path').css("fill", "white");
  //     console.log(this);
  //   });


  // }));
  $('.close-button').on("click", function() {
    $('.how-to').toggleClass('slidedown');
    // $('.how-to').addClass('slideup');
  });

  $('.how-to-link').on("click", function() {
    $('.how-to').toggleClass('slidedown');
    // $('.how-to').addClass('slidedown');
  });

  $('.about-us-link').on("click", function() {
    $('.about-us-link').css("color", "white");
    $('.about-link').css("color", "#d1bf71");
    $('.about').css("display", "none");
    $('.us').css("display", "block");
  });

  $('.about-link').on("click", function() {
    $('.about-link').css("color", "white");
    $('.about-us-link').css("color", "#d1bf71");
    $('.us').css("display", "none");
    $('.about').css("display", "block");
  });

  $('.arrow-down').on('click', function() {
   $(document).scrollTo('.about-nav');
  });

  $('.about-link').css("color", "white");


  $('.submit').on('click', function() {
   console.log("submit click");
  });
// so stateModule.changeState("newstate"); sets the state
//
// and var theState = stateModule.getState(); gets the state

});
