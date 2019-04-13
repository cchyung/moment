// window.onload = function(e){ 
//   console.log("window loaded")
//   $.ajax({
//     url: "/images/username/index",
//     type: 'GET',
//     dataType: 'json', // added data type
//     success: function(res) {
//         console.log(res);
//         let urls = res.images.forEach(element => {
//           urls[element] = element.
//         });
//     }
// });
// }

$(document).ready(() => {
  // retrieves images and renders them
  getImages('markhuds', renderImages);
  
})

// appends images to image container
function renderImages(images) {
  console.log(images)
  let imageContainer = $("#image-container")
  let htmlToAppend = ``
  images['images'].forEach((image) => {
    htmlToAppend += 
    `
      <div class="grid-item waves-effect waves-light photo" id="photo"><img src=${image['url']}></div>
    `
  })
  imageContainer.append(htmlToAppend)
}


Dropzone.options.myAwesomeDropzone = {
  autoProcessQueue: false,
  init: function() {
    this.on("addedfile", function(file) { 
      console.log("added file!");
      // call client upload image method
    });
  }
};


