from googleapiclient.discovery import build

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
        
        return p.annotate(body=d).execute()

    def refresh_client(self):
        self.vision = build('vision', 'v1', cache_discovery=False)