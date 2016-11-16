mk-search
	header
		h1 { query }
	mk-search-posts(query={ query }, event={ event })

style.
	display block
	padding-bottom 32px

	> header
		width 100%
		max-width 600px
		margin 0 auto
		color #555

	> mk-search-posts
		max-width 600px
		margin 0 auto
		background-clip padding-box
		border solid 1px rgba(0, 0, 0, 0.075)
		border-radius 6px
		overflow hidden

script.
	@query = @opts.query
	@event = @opts.event
	@tl-event = riot.observable!

	@on \mount ~>
		@Progress.start!

	@tl-event.on \loaded ~>
		@evemt.trigger \loaded
