"""
code for uploading and deleting from storage
"""
from google.cloud import storage
import random
from datetime import datetime
from PIL import Image
import string
import hashlib

PROJECT_NAME = 'hack-sc-project'

"""
uploads image to google cloud and returns the new file name that is generated randomly
"""
def upload_image(username, image, file_name):
    extension = file_name.split('.')[-1]
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(PROJECT_NAME)
    _id = generate_file_name(image)
    blob = bucket.blob(f'images/{username}/{_id}.{extension}')
    blob.upload_from_string(image)

    return (_id, f'{_id}.{extension}')

def generate_file_name(image):
    m = hashlib.md5()
    m.update(image)
    return m.hexdigest()

# def convert_to_jpeg(image):
    
