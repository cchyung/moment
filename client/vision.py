from googleapiclient.discovery import build
from oauth2client.client import GoogleCredentials

import json
import base64
from io import BytesIO

from PIL import Image
import numpy as np
import requests
import sys

class VisionClient:
    def __init__(self):
        self.vision = build('vision', 'v1', cache_discovery=False)
        return

    def annotate(self, uri):
        p = self.vision.images()
        d = {
            "requests": [
                {
                    "image": {
                        "source": {
                            "imageUri": uri
                        }
                    },
                    "features": {
                        "type": "LABEL_DETECTION"
                    }
                }
            ]
        }
        
        res = p.annotate(body=d).execute()
        return [a.get('description').lower() for a in res.get('responses')[0].get('labelAnnotations')]

    def refresh_client(self):
        self.vision = build('vision', 'v1', cache_discovery=False)


"""
For AI Platform model, resizes image
"""
def make_square(im, min_size=299, fill_color=(255, 255, 255)):
    x, y = im.size
    size = max(min_size, x, y)
    new_im = Image.new('RGB', (size, size), fill_color)
    new_im.paste(im, ((size - x) // 2, (size - y) // 2))
    return new_im

"""
Converts image into dictionary for making request to API
"""
def process(buffer, file_name):
    d = {
        'instances': [{
            'key': file_name,
            'bytes': {
                'b64': str(base64.b64encode(buffer.getvalue()) if sys.version_info.major == 3 else base64.b64encode(str(buffer.getvalue())))[2:-1]
            }
        }]
    }
    return d

class MLClient:
    def __init__(self):
        self.ml = build('ml','v1')
    
    def vectorize(self, url):
        img = Image.open(requests.get(url, stream=True).raw)
        resized_image = make_square(img)
        buffer = BytesIO()
        resized_image.save(buffer, format='JPEG')
        d = process(buffer, 'temp.jpeg')
        res = self.ml.projects().predict(name='projects/hack-sc-project/models/xception', body=d).execute()
        return res.get('predictions')[0].get('global_max_pooling2d')

    def refresh_client(self):
        self.ml = build('ml','v1')

