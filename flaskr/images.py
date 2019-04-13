import functools
from client.vision import VisionClient
from flaskr.__init__ import vc, ml
from flaskr.__init__ import ml

from flask import (
    Flask, Blueprint, flash, g, redirect, render_template, request,
    session, url_for, jsonify
)

from .objects import *

from werkzeug.utils import secure_filename

from flaskr.db import get_db

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

    # TODO: Change this to the URL we get after uploading to GCS
    url = 'https://storage.googleapis.com/hack-sc-project/images/markhuds/party.jpeg'

    # get prediction vector from ML Model
    vector = ml.vectorize(url)
    labels = vc.annotate(url)

    print(labels)

    """
        TODO:
            1. Generate Unique File Name
            2. Run inferences through both models X
            3. Upload to Google Cloud 
    """

    return jsonify(
        {
            'msg': 'image uploaded!',
            'username': username,
            'filename': filename,
            'vector': vector,
            'labels': labels
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

