mk-ui-header
	div.main
		div.backdrop
		div.content
			button.nav#hamburger: i.fa.fa-bars
			h1@title Misskey
			button.post(onclick={ post }): i.fa.fa-pencil

style.
	$height = 48px

	display block
	position fixed
	top 0
	z-index 1024
	width 100%
	box-shadow 0 1px 0 rgba(#000, 0.075)

	> .main
		position relative
		color rgba(#000, 0.6)

		> .backdrop
			position absolute
			top 0
			z-index 1023
			width 100%
			height $height
			-webkit-backdrop-filter blur(12px)
			backdrop-filter blur(12px)
			background-color rgba(#fff, 0.75)

		> .content
			position relative
			z-index 1024

			> h1
				display block
				box-sizing border-box
				margin 0 auto
				padding 0
				width 100%
				max-width calc(100% - 112px)
				text-align center
				font-size 1.1em
				font-weight normal
				line-height $height
				white-space nowrap
				overflow hidden
				text-overflow ellipsis

				> i
				> .icon
					margin-right 8px

			> .nav
				display block
				position absolute
				top 0
				left 0
				width $height
				font-size 1.4em
				line-height $height
				border-right solid 1px rgba(#000, 0.1)

				> i
					transition all 0.2s ease

			> .post
				display block
				position absolute
				top 0
				right 0
				width $height
				font-size 1.4em
				line-height $height
				border-left solid 1px rgba(#000, 0.1)

script.
	@mixin \core
	@mixin \ui

	@on \mount ~>
		@opts.ready!

	@post = ~>
		@core.trigger \post

	@ui.on \title (title) ~>
		@title.innerHTML = title
