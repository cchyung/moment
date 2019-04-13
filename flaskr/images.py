import functools
from client.vision import VisionClient
# from flaskr.__init__ import vc

from flask import (
    Blueprint, flash, g, redirect, render_template, request,
    session, url_for, jsonify
)

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