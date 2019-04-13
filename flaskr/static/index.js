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
      console.log("added file!");
      // call client upload image method
    });
  }
};
