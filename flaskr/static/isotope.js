// $('.grid').isotope({
//   // options
//   itemSelector: '.grid-item',
//   layoutMode: 'cellsByRow'
// });

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