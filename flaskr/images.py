import functools
# from flaskr.__init__ import vc, ml
# from flaskr.__init__ import ml
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

@bp.route('/', methods=('GET',))
def index():
    return render_template('images/index.html')

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

    # TODO: Get image data from elastic search and return

    return jsonify(
        {
            'msg': 'this is the message endpoint',
            'username': username,
            'images': [ image.__dict__ for image in dummy_images() ]
        }
    )

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
    _id, file_name = storage.upload_image('markhuds', buffer.getvalue(), file.filename)

    # TODO: Change this to the URL we get after uploading to GCS
    # file_name = storage.upload_image('markhuds', file)

    url = f'hack-sc-project/images/markhuds/{file_name}'

    print(url)
    
    # get prediction vector from ML Model
    # vector = ml.vectorize(f'https://storage.googleapis.com/{url}')
    # labels = vc.annotate(f'https://storage.googleapis.com/{url}')
    labels = []
    vector = []
    new_image = Image('markhuds', _id, url, vector, labels)
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

