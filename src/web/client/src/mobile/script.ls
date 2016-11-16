# MOBILE CLIENT SCRIPT
#================================

# Define tags
#--------------------------------

require './tags.ls'

# Dependency
#--------------------------------

require './scripts/sp-slidemenu.js'

# Boot
#--------------------------------

boot = require '../base.ls'
mixins = require './mixins.ls'
route = require './router.ls'

boot (me) ~>
	# activate mixins
	mixins me

	# routing
	route me
