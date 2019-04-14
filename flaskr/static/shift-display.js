//initial detatch of similar 
let initial = $('#initial')
let similar = $('#similar')
let isInitialVisible = true
let isSimilarVisible = false

let searchVisible = false
let indexVisible = true

searchView = $('#search-view')
indexView = $('#index-view')

function showSimilar() {
  if(!isSimilarVisible){
    // similar.show()
    // similar.removeClass('hidden')
    similar.css('visibility', 'hidden')
    $('#first-main').append(similar)
    isSimilarVisible = true
  }
}

function hideSimilar() {
  if(isSimilarVisible) {
    // similar.addClass('hidden')
    // setTimeout(() => {
    //   similar.hide()
    // }, 500)
    similar = similar.detach()
    isSimilarVisible = false
  }
}

function showInitial() {
  if(!isInitialVisible){
    // initial.show()
    // initial.removeClass('hidden')
    $('#first-main').append(similar)
    isInitialVisible = true
  }
}

function hideInitial() {
  if(isInitialVisible) {
    // similar.addClass('hidden')
    // setTimeout(() => {
    //   initial.hide()
    // }, 500)
    initial = initial.detach()
    isInitialVisible = false
  }
}

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
    }, 200)
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
    }, 200)
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
  hideInitial()
  showSimilar()
  // $('.grid').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
}));

$('#photo-container').on('click', '.exit', (function (e) {
  hideSimilar()
  setTimeout(() => {
    showInitial()
  }, 500);
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
