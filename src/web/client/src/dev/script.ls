# DEVELOPER CENTER SCRIPT
#================================

# Define tags
#--------------------------------

require './tags.ls'

# Boot
#--------------------------------

boot = require '../base.ls'
route = require './router.ls'

boot (me) ~>
	# routing
	route me
