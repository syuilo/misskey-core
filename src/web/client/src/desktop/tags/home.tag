mk-home
	div.main
		div.left@left
		main: mk-timeline-home-widget(event={ tl-event })
		div.right@right
	mk-detect-slow-internet-connection-notice

style.
	display block

	> .main
		position relative
		margin 0 auto
		width 1100px

		//background-image url('/_/resources/desktop/pages/home/nyaruko.jpg')
		//background-position center center
		//background-attachment fixed
		//background-size cover

		&:after
			content ''
			display block
			clear both

		> *
			position relative
			float left
			box-sizing border-box

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
			width 560px
			padding 16px

		> .left
			width 270px
			padding 16px 0 16px 16px

		> .right
			width 270px
			padding 16px 16px 16px 0

script.
	@mixin \i
	@event = @opts.event

	@home = []
	@tl-event = riot.observable!

	@on \mount ~>
		@I.data.home.for-each (widget) ~>
			el = document.create-element \mk- + widget.name + \-home-widget
			switch widget.place
				| \left => @left.append-child el
				| \right => @right.append-child el
			@home.push (riot.mount el, do
				id: widget.id
				data: widget.data
			.0)

	@on \unmount ~>
		@home.for-each (widget) ~>
			widget.unmount!

	@tl-event.on \loaded ~>
		@event.trigger \loaded
