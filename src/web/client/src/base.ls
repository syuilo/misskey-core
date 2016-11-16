# BASE SCRIPT
#================================

# for subdomains
document.domain = CONFIG.host

# ↓ iOS待ちPolyfill (SEE: http://caniuse.com/#feat=fetch)
require \fetch

# ↓ Firefox, Edge待ちPolyfill
if NodeList.prototype.for-each == undefined
	NodeList.prototype.for-each = Array.prototype.for-each

# Load common dependencies
#--------------------------------

require \velocity
require \chart.js

# Define common tags
#--------------------------------

require './common/tags.ls'

# Boot
#--------------------------------

fetchme = require './fetchme.ls'
mixins = require './mixins.ls'

# Get token from cookie
i = ((document.cookie.match /i=(\w+)/) || [null null]).1

module.exports = (callback) ~>
	# fetch me
	me <~ fetchme i

	# activate mixins
	mixins me

	# destroy loading screen
	init = document.get-element-by-id \init
	init.parent-node.remove-child init

	# set main element
	document.create-element \div
		..set-attribute \id \app
		.. |> document.body.append-child

	try
		callback me
	catch e
		document.body.innerHTML = '<div id="error"><p>致命的な問題が発生しました。</p></div>'
		console.error e
