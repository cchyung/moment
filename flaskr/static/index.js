currentUser = location.href.split('/').slice(-2)[0] 
currentPage = 0

$(document).ready(() => {
  // retrieves images and renders them
  getImages(currentUser, renderImages);
  initSearch()
  setupMore()
})

// appends images to image container
function renderImages(images) {
  let imageContainer = $("#image-container")
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    htmlToAppend += 
    `
      <div class="grid-item waves-effect waves-light photo" id="photo"><img src=https://storage.googleapis.com/${image['source']}></div>
    `
  })
  imageContainer.append(htmlToAppend);

  var grid = $('.grid').isotope({
    // options
    itemSelector: '.grid-item',
    layoutMode: 'packery',
    packery: {
      gutter: 10
    }
  }); 

  $('.grid').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );

  grid.imagesLoaded().progress( function() {
    grid.isotope('layout');
  });
}

/* ======== Load More ======== */
function setupMore() {
  $('#load-more-btn').click(loadMoreImages);
}

function loadMoreImages() {
  getMoreImages(currentUser, currentPage + 1, renderImages)
}

/* ======== Search ======== */
function initSearch() {
  hideSearch()
  searchBar = $('#search')
  searchBar.keydown(searchDebounced)
}

var searchDebounced = debounce(function (e) {
  query = $('#search').val()
  if(query.length != 0) {
    hideIndex();
    setTimeout(() => {
      showSearch();  
    }, 200)
    searchQuery(currentUser, query, renderSearch);
    
  } else {
    hideSearch();
    setTimeout(() => {
      showIndex();
    }, 200)
    
  }
}, 500);

// function search(e) {
//     if(e.keypress)

//     query = $('#search').val()
//     searchQuery(currentUser, query, renderSearch);
// }

function renderSearch(images) {
  let imageContainer = $("#search-results-container")
  imageContainer.empty()
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    htmlToAppend += 
    `
      <div class="grid-item waves-effect waves-light photo" id="photo"><img src=https://storage.googleapis.com/${image['source']}></div>
    `
  })
  imageContainer.append(htmlToAppend);
  var $grid = $('.grid').isotope({
    // options
    itemSelector: '.grid-item',
    layoutMode: 'packery',
    packery: {
      gutter: 10
    }
  }); 
  $grid.imagesLoaded().progress( function() {
    $grid.isotope('layout');
  });
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

Dropzone.options.myAwesomeDropzone = {
  // autoProcessQueue: false,
  acceptedFiles: '.png,.jpg,.jpeg,.JPEG,.JPG,.PNG',
  init: function() {
    this.on("success", function(file, response) { 
      console.log(`${file.name} uploaded successfully`)
    });

    this.on("complete", function(file) {
      setTimeout(() => { this.removeFile(file) }, 2000);
    })
  }
};
