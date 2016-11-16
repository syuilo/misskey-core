# AUTH FORM SCRIPT
#================================

document.title = 'Misskey | アプリの連携'

# Define tags
#--------------------------------

require './tags.ls'

# Boot
#--------------------------------

boot = require '../base.ls'

boot (me) ~>
	# mount
	mount document.create-element \mk-index

# Mount
#================================

riot = require \riot

function mount content
	body = document.get-element-by-id \app
	riot.mount body.append-child content .0
