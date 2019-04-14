currentUser = location.href.split('/').slice(-2)[0] 
currentPage = 0

currentImages = []

$(document).ready(() => {
  // retrieves images and renders them
  getImages(currentUser, renderImages);
  initSearch()
  setupMore()
  loadTags()
  setupImageClick()
})

$('.all-btn').click(function() {
  $('#image-container').isotope({ filter: '*' });
  photosHeader = $('#my-photos-header');
  photosHeader.find('.tag').remove()
})

function initTags() {
  $('.tag').on('click', function() {
    photosHeader = $('#my-photos-header');
    photosHeader.find('.tag').remove()
    tag = $(this).text()
    photosHeader.append($(this).clone())
    getImagesForTag(currentUser, tag, applyFilter)
  })
}

function applyFilter(images) {
  ids = []
  images['images'].forEach((image) => {
    ids.push(image['id'])
  })

  console.log(ids)
  imageContainer = $('#image-container')
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    if(!currentImages.includes(image['id'])){
      currentImages.push(image['id'])
      htmlToAppend = 
      `
        <div class="grid-item waves-effect waves-light photo" id="photo" data-image-id=${image['id']}><img src=https://storage.googleapis.com/${image['source']} ></div>
      `
      imageContainer.append(htmlToAppend);
      renderIsotope()
    }
  })
  
  imageContainer.isotope({
    itemSelector:'.grid-item',
    layoutMode: 'packery',
    packery: {
      gutter: 10
    }
  });

  $('#image-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );

  imageContainer.isotope({
    // filter element with numbers greater than 50
    filter: function() {
      // _this_ is the item element. Get text of element's .number
      var nums = ids
      var number = $(this).data('image-id')
      // return true to show, false to hide
      return nums.includes(number);
    }
  })
}

// appends images to image container
function renderImages(images) {
  let imageContainer = $("#image-container")
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    if(!currentImages.includes(image['id'])){
      currentImages.push(image['id'])
      htmlToAppend += 
      `
        <div class="grid-item waves-effect waves-light photo" id="photo" data-image-id=${image['id']}><img src=https://storage.googleapis.com/${image['source']} ></div>
      `
    }
  })
  imageContainer.append(htmlToAppend);

  $('#image-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );

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

/* ======== Search ================================== */
function initSearch() {
  // tag = $('#search').val()
  // console.log(tag)
  // if(!tag.length == 0) {
  //   console.log('triggered!')
  //   getImagesForTag(currentUser, tag, applyFilter)
  // }
  searchBar = $('#search')
  searchBar.keydown(searchDebounced)
  // hideSearch()
}

var searchDebounced = debounce(function (e) {
  query = $('#search').val()
  if(!query.length == 0) {
    console.log('triggered!')
    searchQuery(currentUser, query, applyFilter)
  }
  else {
    $('#image-container').isotope({ filter: '*' });
  }
}, 500);

// var searchDebounced = debounce(function (e) {
//   query = $('#search').val()
//   if(query.length != 0) {
//     hideIndex();
//     setTimeout(() => {
//       showSearch();  
//     }, 200)
//     searchQuery(currentUser, query, renderSearch);
    
//   } else {
//     hideSearch();
//     setTimeout(() => {
//       showIndex();
//     }, 200)
//   }
// }, 500);

//------------------------------------------------

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


function loadTags() {
  getTopTags(currentUser, renderTags)
}

function renderTags(tags) {
  tagContainer = $('.smart-buttons-container')
  htmlToAppend = ``
  let i = 1
  tags['tags'].forEach((tag) => {
    htmlToAppend += 
    `
    <button type="button" class="tag btn waves-effect btn-color${i++} waves-light">${tag}</button>
    `
  })
  tagContainer.append(htmlToAppend)
  initTags()
}