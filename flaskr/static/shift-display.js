let searchVisible = false
let indexVisible = true

searchView = $('#search-view')
indexView = $('#index-view')

function showSearch() {
  if(!searchVisible){
    searchView.show()
    searchView.removeClass('hidden')
    searchVisible = true
  }
}

function hideSearch() {
  if(searchVisible) {
    searchView.addClass('hidden')
    setTimeout(() => {
      searchView.hide()
    }, 500)
    searchVisible = false
  }
}

function showIndex() {
  if(!indexVisible){
    indexView.show()
    indexView.removeClass('hidden')
    indexVisible = true
  }
}

function hideIndex() {
  if(indexVisible) {
    indexView.addClass('hidden')
    setTimeout(() => {
      indexView.hide()
    }, 500)
    indexVisible = false
  }
}

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
  $('.grid').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
}));

$('#photo-container').on('click', '.exit', (function (e) {
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
