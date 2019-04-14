import functools
from flaskr.__init__ import LOAD_CLIENT
if(LOAD_CLIENT):
    from flaskr.__init__ import vc, ml, es_client
else:
   from flaskr.__init__ import es_client 


from client import storage

from flask import (
    Flask, Blueprint, flash, g, redirect, render_template, request,
    session, url_for, jsonify
)

from .objects import *
from werkzeug.utils import secure_filename
from flaskr.db import get_db
from io import BytesIO
import PIL

bp = Blueprint('auth', __name__, url_prefix='/images')

@bp.route('/<username>/', methods=('GET',))
def index(username):
    return render_template('images/index.html', username=username)

@bp.route('/get-labels', methods=('GET',))
def get_labels():    
    url = request.args.get('path', '')

    # try:
    #     # result = vc.annotate('gs://' + url)
    # except Exception as e:
    #     # vc.refresh_client()
    #     # result = vc.annotate('gs://' + url)
    #     print("vc.annotate failed, getting client again")
        
    return jsonify({'msg': url})

@bp.route('/<username>/index', methods=('GET',))
def get_images(username):
    """
    returns list of all images and labels
    """
    page = request.args.get('page',0)
    page = int(page)

    images = es_client.getUserImages(username, page=page)

    return jsonify(
        {
            'username': username,
            'images': images
        }
    )

@bp.route('/<username>/search', methods=('GET',))
def search(username):
    query = request.args.get('query','')

    # search
    images = es_client.search(username, query)
    
    return jsonify({
        'username': username,
        'images': images
    })

@bp.route('/<username>/similar', methods=('GET',))
def similar(username):
    imageId = request.args.get('imageId','')

    images = es_client.vectorSimilaritySearch(imageId, pageSize=5)
    
    return jsonify({
        'username': username,
        'images': images
    })

@bp.route('/<username>/get-tags', methods=('GET',))
def get_tags(username):
    imageId = request.args.get('imageId','')

    image = es_client.getImage(imageId)
    
    return jsonify({
        'username': username,
        'labels': image.labels
    })

@bp.route('/<username>/get-album', methods=('GET',))
def get_album(username):
    label = request.args.get('label','')

    images = es_client.getAlbum(username, label)
    
    return jsonify({
        'username': username,
        'images': images
    })

@bp.route('/<username>/get-top-tags', methods=('GET',))
def get_top_tags(username):
    tags = es_client.getUserTopTags(username)
    
    return jsonify({
        'username': username,
        'tags': tags
    })

@bp.route('/<username>/upload-image', methods=('POST',))
def upload_image(username):
    """
    takes uploaded image, updates filename, uploads to GCS, and runs inferences
    """

    if 'file' not in request.files:
        flash('No file part')
        return jsonify({'error': 'No file uploaded'})
        
    file = request.files['file']

    if file.filename == '':
        flash('No selected file')
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
    
    buffer = BytesIO()
    file.save(buffer)
    _id, file_name = storage.upload_image(username, buffer.getvalue(), file.filename)

    url = f'hack-sc-project/images/{username}/{file_name}'

    print(url)
    
    # get prediction vector from ML Models
    if(LOAD_CLIENT):
        vector = ml.vectorize(f'https://storage.googleapis.com/{url}')
        labels = vc.annotate(f'https://storage.googleapis.com/{url}')
    else:
        vector=[]
        labels=[]
        
    new_image = Image(username, _id, url, vector, labels)
    es_client.addImage(new_image)

    return jsonify(
        {
            'msg': 'image uploaded',
            'image': new_image.to_json()
        }
    )

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


urls = [
    'https://storage.googleapis.com/hack-sc-project/images/markhuds/0.jpeg',
    'https://storage.googleapis.com/hack-sc-project/images/markhuds/1.jpg',
    'https://storage.googleapis.com/hack-sc-project/images/markhuds/2.jpg',
    'https://storage.googleapis.com/hack-sc-project/images/markhuds/3.jpg',
    'https://storage.googleapis.com/hack-sc-project/images/markhuds/party.jpeg'

]

def dummy_images():
    images = []
    for url in urls:
        images.append(Image('markhuds', 0, url))

    return images

