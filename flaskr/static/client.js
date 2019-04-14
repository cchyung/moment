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

function getMoreImages(username, page, callback) 
{
    console.log(`retrieving more images for ${username}`)
    console.log(page)
    jQuery.ajax({
        url: `${ROOT_URL}/${username}/index`,
        type: 'get',
        data: {
            'page': page
        },
        success: (data) => {
            console.log(data)
            if(data['images'].length > 0) {
                renderImages(data);
                currentPage += 1
            } else {
                noMoreImagesFound()
            }
        }
    })
}

function noMoreImagesFound() {
    $('#load-more-btn').fadeOut(200)
}

function getSimilarImages(username, imageId, callback) 
{
    console.log(`retrieving similar images for ${username}`)

    jQuery.ajax({
        url: `${ROOT_URL}/${username}/similar`,
        type: 'get',
        data: {
            'imageId': imageId
        },
        success: (data) => {
            callback(data)
        }
    })
}

function getTags(username, imageId, callback)
{
    console.log(`getting tags for ${imageId}`)

    jQuery.ajax({
        url: `${ROOT_URL}/${username}/get-tags`,
        type: 'get',
        data: {
            'imageId': imageId
        },
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

function getTopTags(username, callback) {
    jQuery.ajax({
        url:`${ROOT_URL}/${username}/get-top-tags`,
        type: 'GET',
        success: (data) => {
            callback(data)
        }
    })
}

function getImagesForTag(username, tag, callback) {
    jQuery.ajax({
        url: `${ROOT_URL}/${username}/get-album`,
        type: 'GET',
        data: {
            'label': tag
        },
        success: (data) => {
            callback(data)
        }
    })
}

function searchQuery(username, query, callback)
{
    jQuery.ajax({
        url: `${ROOT_URL}/${username}/search`,
        type: 'GET',
        data: {
            'query': query
        },
        success: (data) => {
            callback(data)
        }
    })
}