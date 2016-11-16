mk-home
	mk-home-timeline(event={ tl-event })

style.
	display block
	background #f9f9f9

	> mk-home-timeline
		max-width 500px
		margin 0 auto

	@media (min-width 500px)
		padding 16px

script.
	@event = @opts.event

	@tl-event = riot.observable!

	@tl-event.on \loaded ~>
		@event.trigger \loaded
