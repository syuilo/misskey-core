mk-post-page
	mk-ui: main: mk-post-detail(post={ post }, event={ event })

style.
	display block

	main
		padding 16px

		> mk-post-detail
			margin 0 auto

script.
	@mixin \ui-progress

	@post = @opts.post
	@event = riot.observable!

	@on \mount ~>
		@Progress.start!

	@event.on \post-fetched ~>
		@Progress.set 0.5

	@event.on \loaded ~>
		@Progress.done!
