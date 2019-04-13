const ROOT_URL = 'http://localhost:5000/images'

function getImages(username, callback) 
{
    console.log(`retrieving images for ${username}`)

    jQuery.ajax({
        url: `${ROOT_URL}/${username}/index`,
        type: 'get',
        success: (data) => {
            callback(data)
        }
    })
}

function uploadImage(username, imageFile, callback)
{
    let formData = new FormData()
    formData.append("file", imageFile)

    console.log(`uploading image ${imageFile}`);
    

    jQuery.ajax({
        url: `${ROOT_URL}/${username}/upload-image`,
        type: 'POST',
        data: formData,
        success: (data) => {
            callback(data)
        }
    })
}
