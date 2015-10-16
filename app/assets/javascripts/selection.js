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

  $(".station").on("click", function(e) {
    e.stopImmediatePropagation();
    console.log($(this)[0].__data__.properties.name);
    console.log($(this)[0].__data__.properties.id);

    console.log("first:" + $(this).attr("class"));
    if ($(this).attr("class") === "station") {
      $(this).css("fill", "white");
      $(this).attr("class", "station clicked_sta");
      console.log("second:" + $(this).attr("class"));
      // changeStationClass(this);
    } else {
      console.log("third:" + $(this).attr("class"));
      $(this).attr("class", "station");

      // $(this).attr("class", "station");
      $(this).css("fill", "red")
    }

    console.log(document.getElementsByClassName('clicked_sta'));

  });


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

});
