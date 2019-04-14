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
    }, 400)
    searchVisible = false
  }
}

function showIndex() {
  if(!indexVisible){
    indexView.show( () => {
      $('#image-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
      setTimeout(() => {
        renderIsotope()
      }, 300);
    })
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


function setupImageClick() {
  $("#image-container").on('click', ".photo", (function (e) {
  
    // get tags and load similar images
    imageID = $(this).data('image-id');
    src = $(this).children('img').attr('src')
    let imageContainer = $("#similar-container")

    $('#load-more-btn').hide()
    getSimilarImages(currentUser, imageID, renderSimilar)
    getTags(currentUser, imageID, renderImageTags)

    // UI stuff
    e.stopImmediatePropagation();
    $('#photo-container').animate({height:'20rem'}, {
      duration: 400,
      easing: "easeInOutQuad",
    });
    $("#photo-was-selected").append(
      `
        <div class="waves-effect waves-light selected-item" id="photo" data-image-id="${imageID}" style="position: relative; left: 0px; top: 0px;">
          <img src="${src}">
        </div>
      `
    );

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
  }))
}


function setupSimilarImageClick() {
  $("#similar-container").on('click', ".photo", (function (e) {
  
    // get tags and load similar images
    imageID = $(this).data('image-id');
    src = $(this).children('img').attr('src')
    let imageContainer = $("#similar-container")

    $('#load-more-btn').hide()
    getSimilarImages(currentUser, imageID, renderSimilar)
    getTags(currentUser, imageID, renderImageTags)

    // UI stuff
    e.stopImmediatePropagation();
    $('#photo-container').animate({height:'20rem'}, {
      duration: 400,
      easing: "easeInOutQuad",
    });
    $("#photo-was-selected").empty()
    $("#photo-was-selected").append(
      `
        <div class="waves-effect waves-light selected-item" id="photo" data-image-id="${imageID}" style="position: relative; left: 0px; top: 0px;">
          <img src="${src}">
        </div>
      `
    );

    // $('#photo-container').css({"pading-right": "10px",}).append(
    //   `
    //   <div class="bar"></div>
    //   <a class="btn-floating btn-lg my-0 waves-effect waves-light exit">
    //     <i class="fas fa-times" aria-hidden="true" style="color:white"></i>
    //   </a>
    //   `
    // )
  
    // initial = $('#initial').detach()
    // if(!similar) {
    //   $('#similar').css('visibility', 'visible')
    // }
    // else {
    //   $('#first-main').append(similar)
    // }

    // $('#similar-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
  }))
}

// $("#image-container").on('click', ".photo", (function (e) {
//   console.log("clicked!")
//   $(this).removeClass('photo');
//   $(this).css({"position": "relative", "top": "0", "left": "0"}).removeClass('grid-item').addClass('selected-item')

//   imageID = $(this).data('image-id');

  

  

//   // $(this).animate({width: '15rem'})
//   e.stopImmediatePropagation();
//   $('#photo-container').animate({height:'20rem'}, {
//     duration: 400,
//     easing: "easeInOutQuad",
//   });
//   $(this).appendTo("#photo-was-selected");
//   $('#photo-container').css({"pading-right": "10px",}).append(
//     `
//     <div class="bar"></div>
//     <a class="btn-floating btn-lg my-0 waves-effect waves-light exit">
//       <i class="fas fa-times" aria-hidden="true" style="color:white"></i>
//     </a>
//     `
//   )
  
//   initial = $('#initial').detach()
//   if(!similar) {
//     $('#similar').css('visibility', 'visible')
//   }
//   else {
//     $('#first-main').append(similar)
//   }

//   $('#similar-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
  
// }));

function renderSimilar(images) {
  let imageContainer = $("#similar-container")
  imageContainer.empty()
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    htmlToAppend = 
    `
      <div class="grid-item waves-effect waves-light photo grid-item-similar" id="photo" data-image-id=${image['id']}>
        <img src=https://storage.googleapis.com/${image['source']}>
        <p class='similarity-score'>${image['score'].toFixed(2)}%</p>
      </div>
    `
    imageContainer.append(htmlToAppend)
    renderIsotopeSimilar()
    setupSimilarImageClick()
  })

  $('#similar-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
}

function renderImageTags(labels) {  
  container = $('.selected-tags');
  container.empty()
  let htmlToAppend = `<h3>Tags</h3>`
  let i = 1;
  labels['labels'].slice(0, 5).forEach((label) => {
    htmlToAppend += 
    `
      <button class='btn waves-effect btn-color${i++} waves-light' type="button">${label}</div>
    `
  })
  container.append(htmlToAppend)
  
}

$('#photo-container').on('click', '.exit', (function (e) {
  $('#similar-container').empty()
  similar = $('#similar').detach()
  container= $('.selected-tags')
  container.addClass('hidden')
  container.empty();

  $('#load-more-btn').show()
  
  $('#first-main').append(initial)

  let photo = $('.selected-item')
  $('#photo-was-selected').empty()
  // photo.appendTo("#image-container");
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