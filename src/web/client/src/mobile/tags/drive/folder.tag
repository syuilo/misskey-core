mk-drive-folder(onclick={ onclick })
	div.container
		p.name
			i.fa.fa-folder
			| { folder.name }
		i.fa.fa-angle-right

style.
	display block
	color #777

	&, *
		-webkit-user-select none
		user-select none

	*
		pointer-events none

	> .container
		position relative
		box-sizing border-box
		max-width 500px
		margin 0 auto
		padding 16px

		> .name
			display block
			margin 0
			padding 0

			> i
				margin-right 6px

		> i
			position absolute
			top 0
			bottom 0
			right 8px
			margin auto 0 auto 0
			width 1em
			height 1em

script.
	@browser = @parent

	@onclick = ~>
		@browser.move @opts.folder
