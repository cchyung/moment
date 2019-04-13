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
      var files = $('.dropzone').get(0).dropzone.getAcceptedFiles();
      // var formData = new FormData();
      // formData.append('files', files[0]);
      console.log(file)
      uploadImage("markhuds", files[0], (data) => {
        console.log("file uploaded!")
      })
      // call client upload image method
    });
  }
};


