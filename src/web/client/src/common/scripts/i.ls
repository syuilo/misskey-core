riot = require 'riot'

module.exports = (i) ->

	ev = riot.observable!

	riot.mixin \i do
		init: ->
			@I = i
			@SIGNIN = i?
			@on \mount ~>
				ev.on \update ~>
					@update do
						I: i
		update-i: (data) ->
			if data?
				i := Object.assign i, data
			ev.trigger \update
