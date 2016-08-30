How to create indexes
=====================

Linux
-----

``` shell
curl -XPOST localhost:9200/misskey -d '{
	"settings": {
		"analysis": {
			"analyzer": {
				"bigram": {
					"tokenizer": "bigram_tokenizer"
				}
			},
			"tokenizer": {
				"bigram_tokenizer": {
					"type": "nGram",
					"min_gram": 2,
					"max_gram": 2,
					"token_chars": [
						"letter",
						"digit"
					]
				}
			}
		}
	},
	"mappings": {
		"user": {
			"properties": {
				"username": {
					"type": "string",
					"index": "analyzed",
					"analyzer": "bigram"
				},
				"name": {
					"type": "string",
					"index": "analyzed",
					"analyzer": "kuromoji"
				},
				"bio": {
					"type": "string",
					"index": "analyzed",
					"analyzer": "kuromoji"
				}
			}
		},
		"post": {
			"properties": {
				"text": {
					"type": "string",
					"index": "analyzed",
					"analyzer": "kuromoji"
				}
			}
		}
	}
}'
```

Windows
-------

``` shell
.\curl -XPOST localhost:9200/misskey -d '{
	\"settings\": {
		\"analysis\": {
			\"analyzer\": {
				\"bigram\": {
					\"tokenizer\": \"bigram_tokenizer\"
				}
			},
			\"tokenizer\": {
				\"bigram_tokenizer\": {
					\"type\": \"nGram\",
					\"min_gram\": 2,
					\"max_gram\": 2,
					\"token_chars\": [
						\"letter\",
						\"digit\"
					]
				}
			}
		}
	},
	\"mappings\": {
		\"user\": {
			\"properties\": {
				\"username\": {
					\"type\": \"string\",
					\"index\": \"analyzed\",
					\"analyzer\": \"bigram\"
				},
				\"name\": {
					\"type\": \"string\",
					\"index\": \"analyzed\",
					\"analyzer\": \"kuromoji\"
				},
				\"bio\": {
					\"type\": \"string\",
					\"index\": \"analyzed\",
					\"analyzer\": \"kuromoji\"
				}
			}
		},
		\"post\": {
			\"properties\": {
				\"text\": {
					\"type\": \"string\",
					\"index\": \"analyzed\",
					\"analyzer\": \"kuromoji\"
				}
			}
		}
	}
}'
```