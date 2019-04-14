//initial detatch of similar 
let similar, initial

let searchVisible = false
let indexVisible = true

searchView = $('#search-view')
indexView = $('#first-main')

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

  imageID = $(this).data('image-id');

  // clear similar container
  let imageContainer = $("#similar-container")
  

  getSimilarImages(currentUser, imageID, renderSimilar)
  getTags(currentUser, imageID, renderTags)

  

  // $(this).animate({width: '15rem'})
  e.stopImmediatePropagation();
  $('#photo-container').animate({height:'20rem'}, {
    duration: 400,
    easing: "easeInOutQuad",
  });
  $(this).appendTo("#photo-was-selected");
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
    $('#first-main').append(similar)
  }

  $('#similar-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
  
}));

function renderSimilar(images) {
  let imageContainer = $("#similar-container")
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    htmlToAppend += 
    `
      <div class="grid-item waves-effect waves-light photo grid-item-similar" id="photo" data-image-id=${image['id']}>
        <img src=https://storage.googleapis.com/${image['source']}>
        <p class='similarity-score'>${image['score'].toFixed(2)}%</p>
      </div>
    `
  })
  imageContainer.append(htmlToAppend);

  $('#similar-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
}

function renderTags(labels) {
  container = $('.selected-item');
  let htmlToAppend = ``
  let i = 1;
  labels['labels'].forEach((label) => {
    htmlToAppend += 
    `
      <button class='btn waves-effect btn-color${i++} waves-light' type="button">${label}</div>
    `
  })
  container.append(htmlToAppend);
}

$('#photo-container').on('click', '.exit', (function (e) {
  $('#similar-container').empty()
  similar = $('#similar').detach()
  
  $('#first-main').append(initial)
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