mk-user-home
	div.side
		mk-user-profile(user={ user-promise })
		mk-user-photos(user={ user-promise })
	main
		mk-user-timeline(user={ user-promise }, event={ tl-event })

style.
	display -webkit-flex
	display -moz-flex
	display -ms-flex
	display flex
	justify-content center
	position relative

	> *
		> *
			display block
			position relative
			background-clip padding-box
			//border solid 1px #eaeaea
			border solid 1px rgba(0, 0, 0, 0.075)
			border-radius 6px
			overflow hidden

			&:not(:last-child)
				margin-bottom 16px

	> main
		position relative
		flex 1 1 560px
		box-sizing border-box
		max-width 560px
		margin 0
		padding 16px 0 16px 16px

	> .side
		position relative
		flex 1 1 270px
		max-width 270px
		margin 0
		padding 16px 0 16px 0

script.
	@user-promise = @opts.user
	@event = @opts.event
	@tl-event = riot.observable!

	@tl-event.on \loaded ~>
		@event.trigger \loaded
