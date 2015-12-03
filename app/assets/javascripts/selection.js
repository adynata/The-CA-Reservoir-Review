$(document).ready(function(){


  $('.close-button').on("click", function() {
    $('.how-to').toggleClass('slidedown');
  });

  $('#ss-hover').on("mouseover", function(){
    $('.ss').css('background-color', 'white');
  });

  $('#ss-hover').on("mouseout", function(){
    $('.ss').css('background-color', '#d6b86a');
  });

  $('#hr-hover').on("mouseover", function(){
    $('.hr').css('background-color', 'white');
  });

  $('#hr-hover').on("mouseout", function(){
    $('.hr').css('background-color', '#d6b86a');
  });

  $('#all-hover').on("mouseover", function(){
    $('.all').css('background-color', 'white');
  });

  $('#all-hover').on("mouseout", function(){
    $('.all').css('background-color', '#d6b86a');
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

  $('.about-link').css("color", "white");

  $('.submit').on('click', function() {
   console.log("submit click");
  });



  $(".scroll").on("click", function( e ) {

    e.preventDefault();

    $("body, html").animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 400);

  });

  $(document).ready(
    function() {

      var contactForm = $('#contact-form');

      contactForm.on('submit', function(e) {

        e.preventDefault();

        $.ajax({
          url: contactForm.attr('action'),
          method: contactForm.attr('method'),
          data: contactForm.serialize(),
          dataType: 'json',
          beforeSend: function() {
            contactForm.append('<div class="alert-loading" >...</div>');
          },
          success: function(data) {
            contactForm.find('.alert-loading').remove();
            var succesBox = $('<div class="alert alert-success" role="alert">'+ '<strong>Thanks for reaching out!</strong></div>').hide();
            contactForm.before(succesBox);
            succesBox.fadeIn("slow");
            succesBox.fadeTo(1000, 500).slideUp(500, function() {
              $('input').val('');
              $('textarea').val('');

            });
          },
          error: function(err) {
            contactForm.find('.alert-loading').remove();
            var errorBox = $('<div class="alert alert-danger" role="alert">' + '<strong>Error!</strong> Something went wrong' + '</div>').hide();
            contactForm.before(errorBox);
            errorBox.fadeIn("slow");
            errorBox.fadeTo(2000, 500).slideUp(700, function() {
            });
          }
        });
      });
    });



});
