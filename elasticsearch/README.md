How to create indexes
=====================

Linux
-----

``` shell
curl -XPOST localhost:9200/misskey -d '{
	"mappings": {
		"user": {
			"properties": {
				"username": {
					"type": "string"
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
	\"mappings\": {
		\"user\": {
			\"properties\": {
				\"username\": {
					\"type\": \"string\"
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
