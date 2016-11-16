# Stream
#================================

ReconnectingWebSocket = require 'reconnecting-websocket'
riot = require 'riot'

function init me
	event = riot.observable!
	socket = null

	function connect otherparty
		host = CONFIG.api.url.replace \http \ws
		socket := new ReconnectingWebSocket host + '/messaging?otherparty=' + otherparty

		socket.onopen = ~>
			socket.send JSON.stringify do
				i: me._web

		socket.onmessage = (message) ~>
			try
				message = JSON.parse message.data
				if message.type?
					event.trigger message.type, message.body
			catch
				# ignore

	function close
		socket.close!

	{
		connect
		close
		event
	}

# Export
#--------------------------------

module.exports = init
