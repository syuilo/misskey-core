mk-search-page
	mk-ui: mk-search(query={ parent.opts.query }, event={ parent.event })

style.
	display block

script.
	@mixin \ui-progress

	@event = riot.observable!

	@on \mount ~>
		@Progress.start!

	@event.on \loaded ~>
		@Progress.done!
