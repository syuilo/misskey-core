mk-search-page
	mk-ui: mk-search(query={ parent.opts.query }, event={ parent.event })

style.
	display block

script.
	@mixin \ui
	@mixin \ui-progress

	@event = riot.observable!

	@on \mount ~>
		document.title = 'Misskey | 検索'
		# TODO: クエリをHTMLエスケープ
		@ui.trigger \title '<i class="fa fa-search"></i>' + @opts.query
		@ui.trigger \bg '#f9f9f9'

		@Progress.start!

	@event.on \loaded ~>
		@Progress.done!
