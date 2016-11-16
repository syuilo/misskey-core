riot = require \riot

ui = riot.observable!

ui.on \bg (bg) ~>
	document.document-element.style.background = bg

riot.mixin \ui do
	ui: ui
