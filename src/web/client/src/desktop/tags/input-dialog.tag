mk-input-dialog
	mk-window(controller={ window-controller }, is-modal={ true }, width={ '500px' })
		<yield to="header">
		i.fa.fa-i-cursor
		| { parent.title }
		</yield>
		<yield to="content">
		div.body
			input@text(type='text', oninput={ parent.update }, onkeydown={ parent.on-keydown }, placeholder={ parent.placeholder })
		div.action
			button.cancel(onclick={ parent.cancel }) キャンセル
			button.ok(disabled={ parent.text.value.length == 0 }, onclick={ parent.ok }) 決定
		</yield>

style.
	display block

	> mk-window
		[data-yield='header']
			> i
				margin-right 4px

		[data-yield='content']
			> .body
				padding 16px

				> input
					display block
					box-sizing border-box
					padding 8px
					margin 0
					width 100%
					max-width 100%
					min-width 100%
					font-size 1em
					color #333
					background #fff
					background-clip padding-box
					outline none
					border solid 1px rgba($theme-color, 0.1)
					border-radius 4px
					box-shadow none
					transition border-color .3s ease

					&:hover
						border-color rgba($theme-color, 0.2)
						transition border-color .1s ease

					&:focus
						color $theme-color
						border-color rgba($theme-color, 0.5)
						transition border-color 0s ease

					&::-webkit-input-placeholder
						color rgba($theme-color, 0.3)

			> .action
				position relative
				height 72px
				background lighten($theme-color, 95%)

				.ok
				.cancel
					-webkit-appearance none
					-moz-appearance none
					appearance none
					display block
					position absolute
					bottom 16px
					cursor pointer
					box-sizing border-box
					padding 0
					margin 0
					width 120px
					height 40px
					font-size 1em
					outline none
					border-radius 4px
					box-shadow none

					&:focus
						&:after
							content ""
							pointer-events none
							position absolute
							top -5px
							right -5px
							bottom -5px
							left -5px
							border 2px solid rgba($theme-color, 0.3)
							border-radius 8px

					&:disabled
						opacity 0.7
						cursor default

				.ok
					right 16px
					color $theme-color-foreground
					background linear-gradient(to bottom, lighten($theme-color, 25%) 0%, lighten($theme-color, 10%) 100%)
					border solid 1px lighten($theme-color, 15%)

					&:not(:disabled)
						font-weight bold

					&:hover:not(:disabled)
						background linear-gradient(to bottom, lighten($theme-color, 8%) 0%, darken($theme-color, 8%) 100%)
						border-color $theme-color

					&:active:not(:disabled)
						background $theme-color
						border-color $theme-color

				.cancel
					right 148px
					color #888
					background linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%)
					border solid 1px #e2e2e2

					&:hover
						background linear-gradient(to bottom, #f9f9f9 0%, #ececec 100%)
						border-color #dcdcdc

					&:active
						background #ececec
						border-color #dcdcdc

script.
	@done = false

	@title = @opts.title
	@placeholder = @opts.placeholder
	@default = @opts.default

	@window-controller = riot.observable!

	@on \mount ~>
		@text = @tags['mk-window'].text
		if @default?
			@text.value = @default
		@window-controller.trigger \open
		@text.focus!

	@window-controller.on \closing ~>
		if @done
			@opts.on-ok @text.value
		else
			if @opts.on-cancel?
				@opts.on-cancel!

	@window-controller.on \closed ~>
		@unmount!

	@cancel = ~>
		@done = false
		@window-controller.trigger \close

	@ok = ~>
		@done = true
		@window-controller.trigger \close

	@on-keydown = (e) ~>
		if e.which == 13 # Enter
			e.prevent-default!
			e.stop-propagation!
			@ok!
		true # Riot 3.0.0 にしたら削除して大丈夫かも
