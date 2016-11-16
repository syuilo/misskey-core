mk-post-detail-sub
	a.avatar-anchor(href={ CONFIG.url + '/' + post.user.username })
		img.avatar(src={ post.user.avatar_url + '?thumbnail&size=64' }, alt='avatar', data-user-preview={ post.user.id })
	div.main
		header
			div.left
				a.name(href={ CONFIG.url + '/' + post.user.username }, data-user-preview={ post.user.id })
					| { post.user.name }
				span.username
					| @{ post.user.username }
			div.right
				a.time(href={ url })
					mk-time(time={ post.created_at })
		div.body
			div.text@text
			div.images(if={ post.images })
				virtual(each={ file in post.images })
					img(src={ file.url + '?thumbnail&size=512' }, alt={ file.name }, title={ file.name })

style.
	display block
	position relative
	margin 0
	padding 20px 32px
	font-family 'Meiryo', 'メイリオ', sans-serif
	background #fdfdfd
	background-clip padding-box

	&:after
		content ""
		display block
		clear both

	&:hover
		> .main > footer > button
			color #888

	> .avatar-anchor
		display block
		float left
		margin 0 16px 0 0

		> .avatar
			display block
			width 44px
			height 44px
			margin 0
			border-radius 4px
			vertical-align bottom

	> .main
		float left
		width calc(100% - 60px)

		> header
			margin-bottom 4px
			white-space nowrap

			&:after
				content ""
				display block
				clear both

			> .left
				float left

				> .name
					display inline
					margin 0
					padding 0
					color #777
					font-size 1em
					font-weight 700
					text-align left
					text-decoration none

					&:hover
						text-decoration underline

				> .username
					text-align left
					margin 0 0 0 8px
					color #ccc

			> .right
				float right

				> .time
					font-size 0.9em
					color #c0c0c0

		> .body

			> .text
				cursor default
				display block
				margin 0
				padding 0
				word-wrap break-word
				font-size 1em
				color #717171

				> mk-url-preview
					margin-top 8px

			> .images
				> img
					display block
					max-width 100%

script.
	@mixin \api
	@mixin \text
	@mixin \user-preview

	@reply-form = null
	@reply-form-controller = riot.observable!

	@repost-form = null
	@repost-form-controller = riot.observable!

	@on \mount ~>
		@post = opts.post
		@url = CONFIG.url + '/' + @post.user.username + '/' + @post.id

		if @post.text?
			tokens = @analyze @post.text
			@text.innerHTML = @compile tokens

			@text.child-nodes.for-each (e) ~>
				if e.tag-name == \MK-URL
					riot.mount e

	@reply = ~>
		if !@reply-form?
			@reply-form = document.body.append-child document.create-element \mk-post-form-window
			riot.mount @reply-form, do
				controller: @reply-form-controller
				reply: @p
		@reply-form-controller.trigger \open

	@repost = ~>
		if !@repost-form?
			@repost-form = document.body.append-child document.create-element \mk-repost-form-window
			riot.mount @repost-form, do
				controller: @repost-form-controller
				post: @p
		@repost-form-controller.trigger \open
	
	@like = ~>
		if @post.is_liked
			@api \posts/likes/delete do
				post: @post.id
			.then ~>
				@post.is_liked = false
				@update!
		else
			@api \posts/likes/create do
				post: @post.id
			.then ~>
				@post.is_liked = true
				@update!
