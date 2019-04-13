"""
code for uploading and deleting from storage
"""
from google.cloud import storage
import random
from datetime import datetime
from PIL import Image
import string


PROJECT_NAME = 'hack-sc-project'

"""
uploads image to google cloud and returns the new file name that is generated randomly
"""
def upload_image(username, image, file_name):
    extension = file_name.split('.')[-1]
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(PROJECT_NAME)
    new_file_name = generate_file_name()
    blob = bucket.blob(f'images/{username}/{new_file_name}.{extension}')
    blob.upload_from_string(image)

    return f'{new_file_name}.{extension}'

def generate_file_name():
    random.seed(datetime.now())
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=32))

# def convert_to_jpeg(image):
    
