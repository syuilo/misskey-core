mk-dialog
	div.bg@bg(onclick={ bg-click })
	div.main@main
		header@header
		div.body@body
		div.buttons
			virtual(each={ opts.buttons })
				button(onclick={ _onclick }) { text }

style.
	display block

	> .bg
		display block
		position fixed
		z-index 8192
		top 0
		left 0
		width 100%
		height 100%
		background rgba(0, 0, 0, 0.7)
		opacity 0
		pointer-events none

	> .main
		display block
		box-sizing border-box
		position fixed
		z-index 8192
		top 20%
		left 0
		right 0
		margin 0 auto 0 auto
		padding 32px 42px
		width 480px
		background #fff

		*:not(i)
			font-family 'メイリオ', 'Meiryo', sans-serif !important

		> header
			margin 1em 0
			color $theme-color
			// color #43A4EC
			font-weight bold

			> i
				margin-right 0.5em

		> .body
			margin 1em 0
			color #888

		> .buttons
			> button
				display inline-block
				float right
				box-sizing border-box
				margin 0
				padding 10px 10px
				font-size 1.1em
				font-weight normal
				text-decoration none
				color #888
				background transparent
				outline none
				border none
				border-radius 0
				box-shadow none
				cursor pointer
				transition color 0.1s ease

				i
					margin 0 0.375em

				&:hover
					color $theme-color

				&:active
					color darken($theme-color, 10%)
					transition color 0s ease

script.
	@can-through = if opts.can-through? then opts.can-through else true
	@controller = @opts.controller
	@opts.buttons.for-each (button) ~>
		button._onclick = ~>
			if button.onclick?
				button.onclick!
			@close!

	@on \mount ~>
		@header.innerHTML = @opts.title
		@body.innerHTML = @opts.text

	@controller.on \open ~>
		@open!

	@controller.on \close ~>
		@close!

	@open = ~>
		@bg.style.pointer-events = \auto
		Velocity @bg, \finish true
		Velocity @bg, {
			opacity: 1
		} {
			queue: false
			duration: 100ms
			easing: \linear
		}

		Velocity @main, {
			opacity: 0
			scale: 1.2
		} {
			duration: 0
		}
		Velocity @main, {
			opacity: 1
			scale: 1
		} {
			duration: 300ms
			easing: [ 0, 0.5, 0.5, 1 ]
		}

	@close = ~>
		@bg.style.pointer-events = \none
		Velocity @bg, \finish true
		Velocity @bg, {
			opacity: 0
		} {
			queue: false
			duration: 300ms
			easing: \linear
		}

		@main.style.pointer-events = \none
		Velocity @main, \finish true
		Velocity @main, {
			opacity: 0
			scale: 0.8
		} {
			queue: false
			duration: 300ms
			easing: [ 0.5, -0.5, 1, 0.5 ]
			complete: ~>
				@unmount!
		}

	@bg-click = ~>
		if @can-through
			if @opts.on-through?
				@opts.on-through!
			@close!
