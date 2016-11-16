mk-repost-form
	mk-post-preview(post={ opts.post })
	div.form(if={ quote })
		textarea@text(disabled={ wait }, placeholder='この投稿を引用...')
	a.quote(if={ !quote }, onclick={ onquote }) 引用する...
	footer
		button.cancel(onclick={ cancel }) キャンセル
		button.ok(onclick={ ok }) Repost

style.

	> mk-post-preview
		margin 16px 22px

	> .form
		[name='text']
			display block
			box-sizing border-box
			padding 12px
			margin 0
			width 100%
			max-width 100%
			min-width 100%
			min-height calc(1em + 12px + 12px)
			font-size 1em
			color #333
			background #fff
			background-clip padding-box
			outline none
			border solid 1px rgba($theme-color, 0.1)
			border-radius 4px
			box-shadow none
			transition border-color .3s ease
			font-family 'Meiryo', 'メイリオ', 'Meiryo UI', sans-serif

			&:hover
				border-color rgba($theme-color, 0.2)
				transition border-color .1s ease

			&:focus
				color $theme-color
				border-color rgba($theme-color, 0.5)
				transition border-color 0s ease

			&:disabled
				opacity 0.5

			&::-webkit-input-placeholder
				color rgba($theme-color, 0.3)

	> .quote
		position absolute
		bottom 16px
		left 28px
		line-height 40px

	> div
		padding 16px

	> footer
		height 72px
		background lighten($theme-color, 95%)

		button
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

		> .cancel
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

		> .ok
			right 16px
			font-weight bold
			color $theme-color-foreground
			background linear-gradient(to bottom, lighten($theme-color, 25%) 0%, lighten($theme-color, 10%) 100%)
			border solid 1px lighten($theme-color, 15%)

			&:hover
				background linear-gradient(to bottom, lighten($theme-color, 8%) 0%, darken($theme-color, 8%) 100%)
				border-color $theme-color

			&:active
				background $theme-color
				border-color $theme-color

script.
	@mixin \api

	@event = @opts.event
	@wait = false
	@quote = false

	@cancel = ~>
		@event.trigger \cancel

	@ok = ~>
		@wait = true
		@api \posts/create do
			repost: @opts.post.id
			text: if @quote then @text.value else undefined
		.then (data) ~>
			@event.trigger \posted
			#@opts.ui.trigger \notification '投稿しました。'
		.catch (err) ~>
			console.error err
			#@opts.ui.trigger \notification 'Error!'
		.then ~>
			@wait = false
			@update!

	@onquote = ~>
		@quote = true
