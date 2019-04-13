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
  // setupUpload()
  
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
  imageContainer.append(htmlToAppend)
}

// function setupUpload() {
  Dropzone.options.myAwesomeDropzone = {
    // autoProcessQueue: false,
    init: function() {
      this.on("success", function(file, response) { 
        console.log(`${file.name} uploaded successfully`)
      });

      this.on("complete", function(file) {
        setTimeout(() => { this.removeFile(file) }, 2000);
      })
    }
  };
// }





