"""
    contains object classes for the server
"""
import json

class BaseObject():
    def to_json(self):
        return json.dumps(self.__dict__)

class Image(BaseObject):
    def __init__(self, user, id, url, vector=[], labels=[]):
        self.id=id
        self.url=url
        self.vector=vector
        self.labels=labels
        self.user=user

    def __str__(self):
        return f'{self.user}-{self.id}'

class Album(BaseObject):
    def __init__(self, user, id, name, images=[]):
        self.id=id
        self.name=name
        self.images=images
        self.user=user

    def __str__(self):
        return f'{self.user}-{self.name}'
