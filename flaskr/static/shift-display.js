$(".photo").click(function (e) {
  $(this).removeClass('photo');
  $(this).css("position", "relative")
  $(this).animate({scale: '150%'})
  $('.photo').css("background-color", "white");
  e.stopImmediatePropagation();
  $('#photo-container').animate({height:'500px'}, {
    duration: 400,
    easing: "easeInOutQuad",
  });
  $(this).appendTo("#photo-container");
});
