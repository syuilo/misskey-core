mk-drive-selector
	div.bg@bg
	div.body@body
		header
			button.close(onclick={ close }): i.fa.fa-times
			h1
				| ファイルを選択
				span.count(if={ files.length > 0 }) ({ files.length })
			button.ok(onclick={ ok }): i.fa.fa-check
		mk-drive(select={ true }, xmultiple={ opts.multiple }, controller={ controller }, event={ event })

style.
	display block

	> .bg
		position fixed
		z-index 2048
		top 0
		left 0
		width 100%
		height 100%
		background rgba(#000, 0.5)

	> .body
		position fixed
		z-index 2048
		top 16px
		left 0
		right 0
		margin 0 auto
		box-sizing border-box
		width calc(100% - 32px)
		max-width 500px
		height calc(100% - 32px)
		overflow hidden
		background #fff
		border-radius 8px
		box-shadow 0 0 16px rgba(#000, 0.3)

		> header
			border-bottom solid 1px #eee

			> h1
				margin 0
				padding 0
				text-align center
				line-height 42px
				font-size 1em
				font-weight normal

				> .count
					margin-left 4px
					opacity 0.5

			> .close
				position absolute
				top 0
				left 0
				line-height 42px
				width 42px

			> .ok
				position absolute
				top 0
				right 0
				line-height 42px
				width 42px

		> mk-drive
			height calc(100% - 42px)
			overflow scroll

script.
	@mixin \window

	@cb = opts.callback
	@event = riot.observable!
	@controller = riot.observable!
	@files = []

	@event.on \change-selected (files) ~>
		@files = files
		@update!

	@ok = ~>
		@cb @files
		@close!
