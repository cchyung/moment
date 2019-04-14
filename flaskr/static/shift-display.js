//initial detatch of similar 
let initial, similar;
isInitialVisible = true;
isSimilarVisible = false;


$("#image-container").on('click', ".photo", (function (e) {
  console.log("clicked!")
  $(this).removeClass('photo');
  $(this).css({"position": "relative", "top": "0", "left": "0"}).removeClass('grid-item').addClass('selected-item')
  // $(this).animate({width: '15rem'})
  e.stopImmediatePropagation();
  $('#photo-container').animate({height:'20rem'}, {
    duration: 400,
    easing: "easeInOutQuad",
  });
  $(this).appendTo("#photo-container");
  $('#photo-container').css({"pading-right": "10px",}).append(
    `
    <div class="bar"></div>
    <a class="btn-floating btn-lg my-0 waves-effect waves-light exit">
      <i class="fas fa-times" aria-hidden="true" style="color:white"></i>
    </a>
    `
  )
  initial = $('#initial').detach()
  if(!similar) {
    $('#similar').css('visibility', 'visible')
  }
  else {
    $('.main').append(similar)
  }
  $('.grid').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
}));

$('#photo-container').on('click', '.exit', (function (e) {
  similar = $('#similar').detach()
  $('.main').append(initial)
  let photo = $('.selected-item')
  photo.appendTo("#image-container");
  $('#photo-container').animate({height:'0px'}, {
    duration: 400,
    easing: "easeInOutQuad",
  });
  console.log("clicked large photo!")
  photo.addClass('grid-item').removeClass('selected-item').addClass('photo')
  // $(this).animate({width: '15rem'})
  e.stopImmediatePropagation();
  $('.exit').remove()
  $('.bar').remove()
  $('.grid').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );

}));
