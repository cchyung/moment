import base64
import struct
import json
import time
from elasticsearch import Elasticsearch

class ESClient:
    def __init__(self):
        es_server = '35.184.175.102'
        es_user = 'elastic'
        es_pwd = 'espwd'
        self.es = Elasticsearch("http://{}:9200".format(es_server), http_auth=(es_user, es_pwd))
    
    def encode_vector(self, vector):
        data = bytearray()
        for v in vector:
            data.extend(bytearray(struct.pack('!f', v)))
        return base64.b64encode(data).decode('utf-8')
    
    def addImage(self, image):
        _id = image._id
        doc = {
            'id': _id,
            'user_id': image.user,
            'source': image.url,
            'timestamp': int(time.time())
        }
        if image.labels:
            doc['labels'] = image.labels
        if image.vector:
            doc['vector'] = list(image.vector)
            doc['encoded_vector'] = self.encode_vector(image.vector)
        return self.es.index(index='images-index', doc_type='doc', id=_id, body=doc)
    
    def getImage(self, _id):
        d = self.es.get(index="images-index", doc_type='doc', id=_id).get('_source')
        im = Image(d.get('user_id'), _id, d.get('source'), vector=d.get('vector'), labels=d.get('labels'))
        return im

    def getUserImages(self, user, pageSize=10, page=0):
      q = {
        "size": pageSize,
        "from": page * pageSize,
        "_source": ["id", "user_id", "source", "labels"],
        "query": {
          "bool": {
            "must": [
              {
                "term": {
                  "user_id": {
                    "value": user
                  }
                }
              }
            ]
          }
        },
        "sort": [
            {
                "timestamp": {
                    "order": "desc"
                }
            }
        ]
      }
      return [hit.get('_source') for hit in self.es.search(index='images-index', body=q).get('hits', {}).get('hits', [])]

    
    def getAlbum(self, user, label, pageSize=20, page=0):
        q = {
          "size": pageSize,
          "from": page * pageSize,
          "_source": ["id", "user_id", "source", "labels"],
          "query": {
            "bool": {
              "must": [
                {
                  "term": {
                    "user_id": {
                      "value": user
                    }
                  }
                },
                {
                  "term": {
                    "labels.keyword": label
                  }
                }
              ]
            }
          }
        }
        return [hit.get('_source') for hit in self.es.search(index='images-index', body=q).get('hits', {}).get('hits', [])]
    
    def search(self, user, search, pageSize=20, page=0):
        q = {
          "size": pageSize,
          "from": page * pageSize,
          "_source": ["id", "user_id", "source", "labels"],
          "query": {
            "bool": {
              "must": [
                {
                  "term": {
                    "user_id": {
                      "value": user
                    }
                  }
                },
                {
                  "match": {
                    "labels": search
                  }
                }
              ]
            }
          }
        }
        return [hit.get('_source') for hit in self.es.search(index='images-index', body=q).get('hits', {}).get('hits', [])]
    
    def vectorSimilaritySearch(self, _id, pageSize=20, page=0):
        im = self.getImage(_id)
        vector = im.vector
        user = im.user
        
        q = {
          "size": pageSize,
          "from": page * pageSize,
          "_source": ["id", "user_id", "source", "labels"],
          "query": {
            "function_score": {
              "functions": [
                  {
                  "script_score": {
                      "script": {
                          "params": {
                              "seed_vector_string" : self.encode_vector(vector)
                          },
                          "source": "byte[] seed_bytes = Base64.getDecoder().decode(params.seed_vector_string); byte[] bytes = Base64.getDecoder().decode(doc['encoded_vector'].value); float[] seed_floats = new float[2048]; float[] floats = new float[2048]; for (int i = 0; i < 2048; i++) { int result = 0; int seed_result = 0; for (int j = 0; j < 4; j++) {result <<= 8; seed_result <<= 8; result |= (bytes[i*4+j] & 255); seed_result |= (seed_bytes[i*4+j] & 255); } seed_floats[i] = Float.intBitsToFloat(seed_result);  floats[i] = Float.intBitsToFloat(result); } float top = 0, bottom_seed = 0, bottom = 0; for(int i = 0; i < 2048; i++) {top += floats[i] * seed_floats[i]; bottom_seed += seed_floats[i]* seed_floats[i]; bottom += floats[i]*floats[i]; } return top/(Math.sqrt(bottom)*Math.sqrt(bottom_seed))"
                      }
                  }
                  }
              ],
              "score_mode": "sum",
              "boost_mode": "sum",
              "query": {
                "bool": {
                    "must": [
                        {
                          "exists": {
                            "field": "encoded_vector"
                          }
                        },
                        {
                            "term": {
                                "user_id": {
                                    "value": user
                                } 
                            }
                        }
                    ]
                }
              }
            }
          }
        }
        return [hit.get('_source') for hit in self.es.search(index='images-index', body=q).get('hits', {}).get('hits', [])]
        
#     def addAlbum():
    
#     def searchAlbum