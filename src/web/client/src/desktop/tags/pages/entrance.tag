mk-entrance
	main
		ul@title
			li m
			li i
			li s
			li s
			li k
			li e
			li y
			li: i ・
			//
				li: i ・
				li: i ・
				li
				li
				li: i ・
				li
				li
				li

		div.form
			mk-entrance-signin(if={ mode == 'signin' }, onsignup={ signup })
			mk-entrance-signup(if={ mode == 'signup' }, onsignin={ signin })

	footer
		p (c) syuilo 2014-2016

style.
	display block
	height 100%
	font-family 'Meiryo', 'メイリオ', 'Meiryo UI', sans-serif

	> main
		display block
		position relative

		&:after
			content ''
			display block
			clear both

		> ul
			$tile = 48px

			width $tile * 4
			margin 0 auto
			padding $tile
			font-size ($tile / 3)
			font-weight bold
			color #555
			list-style none

			&:after
				content ''
				display block
				clear both

			> li
				display block
				float left
				width $tile
				height $tile
				line-height $tile
				text-align center
				user-select none
				cursor default

				&:hover
					background #fff

				&:first-child
					color $theme-color-foreground
					background $theme-color !important

				&:nth-child(5)
					color #fff
					background #444

				> i
					font-style normal
					opacity 0.3

	> footer
		> p
			margin 0
			text-align center
			line-height 64px
			font-size 10px
			color rgba(#000, 0.5)

script.
	@mixin \sortable

	@mode = \signin

	@on \mount ~>
		new @Sortable @title, do
			animation: 150ms

	@signup = ~>
		@mode = \signup
		@update!

	@signin = ~>
		@mode = \signin
		@update!
