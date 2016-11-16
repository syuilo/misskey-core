riot = require \riot

module.exports = (me) ~>

	if me?
		(require './scripts/stream.ls') me

	(require './scripts/core.ls') me

	require './scripts/ui.ls'

	require './scripts/window.ls'

