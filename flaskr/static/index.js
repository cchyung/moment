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
