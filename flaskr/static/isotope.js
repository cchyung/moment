
var $similar = $('#similar-container').isotope({
  // options
  itemSelector: '.grid-item',
  layoutMode: 'packery',
  packery: {
    gutter: 10
  }
}); 

var grid = $('#image-container').isotope({
  // options
  itemSelector: '.grid-item',
  layoutMode: 'packery',
  packery: {
    gutter: 10
  }
}); 


function renderIsotopeSimilar() {
  console.log('rerendering isotope')

  $similar.imagesLoaded().progress( function() {
    $similar.isotope('layout');
  });
  $('#similar-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
}

function renderIsotope() {
  console.log('rerendering initial isotope')
  grid.imagesLoaded().progress( function() {
    grid.isotope('layout');
  });
  $('#image-container').isotope( 'reloadItems' ).isotope( { sortBy: 'original-order' } );
  $('#image-container').isotope('layout')
}

$.Isotope.prototype._masonryReset = function() {
  // layout-specific props
  this.masonry = {};
  // FIXME shouldn't have to call this again
  this._getCenteredMasonryColumns();
  var i = this.masonry.cols;
  this.masonry.colYs = [];
  while (i--) {
    this.masonry.colYs.push( 0 );
  }
};