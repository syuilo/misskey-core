mk-post-page
	mk-ui: main: mk-post-detail(post={ post }, event={ event })

style.
	display block

	main
		background #fff

		> mk-post-detail
			width 100%
			max-width 500px
			margin 0 auto

script.
	@mixin \ui
	@mixin \ui-progress

	@post = @opts.post
	@event = riot.observable!

	@on \mount ~>
		#document.title = 'Misskey'
		#@ui.trigger \title '<i class="fa fa-sticky-note-o"></i>投稿'
		@ui.trigger \bg '#f00'

		@Progress.start!

	@event.on \post-fetched ~>
		@Progress.set 0.5

	@event.on \loaded ~>
		@Progress.done!
