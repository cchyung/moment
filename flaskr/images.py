import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request,
    session, url_for
)

from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='images')

@bp.route('/', methods=('GET'))
def index():
    return render_template('images/index.html')