mk-post-detail(title={ title }, class={ repost: is-repost })

	div.fetching(if={ fetching })
		mk-ellipsis-icon

	div.main(if={ !fetching })

		button.read-more(if={ p.reply_to.reply_to && context == null }, title='会話をもっと読み込む', onclick={ load-context }, disabled={ loading-context })
			i.fa.fa-ellipsis-v(if={ !loading-context })
			i.fa.fa-spinner.fa-pulse(if={ loading-context })

		div.context
			virtual(each={ post in context })
				mk-post-detail-sub(post={ post })

		div.reply-to(if={ p.reply_to })
			mk-post-detail-sub(post={ p.reply_to })

		div.repost(if={ is-repost })
			p
				a.avatar-anchor(href={ CONFIG.url + '/' + post.user.username }, data-user-preview={ post.user.id }): img.avatar(src={ post.user.avatar_url + '?thumbnail&size=32' }, alt='avatar')
				i.fa.fa-retweet
				a.name(href={ CONFIG.url + '/' + post.user.username }) { post.user.name }
				| がRepost

		article
			a.avatar-anchor(href={ CONFIG.url + '/' + p.user.username })
				img.avatar(src={ p.user.avatar_url + '?thumbnail&size=64' }, alt='avatar', data-user-preview={ p.user.id })
			header
				a.name(href={ CONFIG.url + '/' + p.user.username }, data-user-preview={ p.user.id })
					| { p.user.name }
				span.username
					| @{ p.user.username }
				a.time(href={ url })
					mk-time(time={ p.created_at })
			div.body
				div.text@text
				div.images(if={ p.images })
					virtual(each={ file in p.images })
						img(src={ file.url + '?thumbnail&size=512' }, alt={ file.name }, title={ file.name })
			footer
				button(onclick={ reply }, title='返信')
					i.fa.fa-reply
					p.count(if={ p.replies_count > 0 }) { p.replies_count }
				button(onclick={ repost }, title='Repost')
					i.fa.fa-retweet
					p.count(if={ p.repost_count > 0 }) { p.repost_count }
				button(class={ liked: p.is_liked }, onclick={ like }, title='善哉')
					i.fa.fa-thumbs-o-up
					p.count(if={ p.likes_count > 0 }) { p.likes_count }
				button(onclick={ NotImplementedException }): i.fa.fa-ellipsis-h
			div.reposts-and-likes
				div.reposts(if={ reposts.length > 0 })
					header
						a { p.repost_count }
						p Repost
					ol.users
						li.user(each={ reposts })
							a.avatar-anchor(href={ CONFIG.url + '/' + user.username }, title={ user.name }, data-user-preview={ user.id })
								img.avatar(src={ user.avatar_url + '?thumbnail&size=32' }, alt='')
				div.likes(if={ likes.length > 0 })
					header
						a { p.likes_count }
						p いいね
					ol.users
						li.user(each={ likes })
							a.avatar-anchor(href={ CONFIG.url + '/' + username }, title={ name }, data-user-preview={ id })
								img.avatar(src={ avatar_url + '?thumbnail&size=32' }, alt='')

		div.replies
			virtual(each={ post in replies })
				mk-post-detail-sub(post={ post })

style.
	display block
	position relative
	margin 0
	padding 0
	width 640px
	overflow hidden
	font-family 'Meiryo', 'メイリオ', sans-serif
	background #fff
	background-clip padding-box
	border solid 1px rgba(0, 0, 0, 0.1)
	border-radius 8px

	> .fetching
		padding 64px 0

	> .main

		> .read-more
			-webkit-appearance none
			-moz-appearance none
			appearance none
			display block
			box-sizing border-box
			margin 0
			padding 10px 0
			width 100%
			font-size 1em
			text-align center
			color #999
			cursor pointer
			background #fafafa
			outline none
			border none
			border-bottom solid 1px #eef0f2
			border-radius 6px 6px 0 0
			box-shadow none

			&:hover
				background #f6f6f6

			&:active
				background #f0f0f0

			&:disabled
				color #ccc

		> .context
			> *
				border-bottom 1px solid #eef0f2

		> .repost
			color #9dbb00
			background linear-gradient(to bottom, #edfde2 0%, #fff 100%)

			> p
				margin 0
				padding 16px 32px

				.avatar-anchor
					display inline-block

					.avatar
						vertical-align bottom
						min-width 28px
						min-height 28px
						max-width 28px
						max-height 28px
						margin 0 8px 0 0
						border-radius 6px

				i
					margin-right 4px

				.name
					font-weight bold

			& + article
				padding-top 8px

		> .reply-to
			border-bottom 1px solid #eef0f2

		> article
			position relative
			padding 28px 32px 18px 32px

			&:after
				content ""
				display block
				clear both

			&:hover
				> .main > footer > button
					color #888

			> .avatar-anchor
				display block
				width 60px
				height 60px

				> .avatar
					display block
					width 60px
					height 60px
					margin 0
					border-radius 8px
					vertical-align bottom

			> header
				position absolute
				top 28px
				left 108px
				width calc(100% - 108px)

				> .name
					display inline-block
					margin 0
					color #777
					font-size 1.2em
					font-weight 700
					text-align left
					text-decoration none

					&:hover
						text-decoration underline

				> .username
					display block
					text-align left
					margin 0
					color #ccc

				> .time
					position absolute
					top 0
					right 32px
					font-size 1em
					color #c0c0c0

			> .body
				padding 8px 0

				> .text
					cursor default
					display block
					margin 0
					padding 0
					word-wrap break-word
					font-size 1.5em
					color #717171

					> mk-url-preview
						margin-top 8px

				> .images
					> img
						display block
						max-width 100%

			> footer
				font-size 1.2em

				> button
					margin 0 28px 0 0
					padding 8px
					background transparent
					border none
					box-shadow none
					font-size 1em
					color #ddd
					cursor pointer

					&:hover
						color #666

					> .count
						display inline
						margin 0 0 0 8px
						color #999
					
					&.liked
						color $theme-color

			> .reposts-and-likes
				display flex
				justify-content center
				padding 0
				margin 16px 0

				&:empty
					display none

				> .reposts
				> .likes
					display flex
					flex 1 1
					padding 0
					border-top solid 1px #F2EFEE

					> header
						flex 1 1 80px
						box-sizing border-box
						max-width 80px
						padding 8px 5px 0px 10px

						> a
							display block
							font-size 1.5em
							line-height 1.4em

						> p
							display block
							margin 0
							font-size 0.7em
							line-height 1em
							font-weight normal
							color #a0a2a5

					> .users
						display block
						flex 1 1
						margin 0
						padding 10px 10px 10px 5px
						list-style none

						> .user
							display block
							position relative
							float left
							margin 4px
							padding 0

							> .avatar-anchor
								display:block

								> .avatar
									vertical-align bottom
									width 24px
									height 24px
									border-radius 4px

				> .reposts + .likes
					margin-left 16px

		> .replies
			> *
				border-top 1px solid #eef0f2

script.
	@mixin \api
	@mixin \text
	@mixin \user-preview
	@mixin \NotImplementedException

	@fetching = true
	@loading-context = false
	@content = null
	@post = null
	@post-promise = new Promise (resolve, reject) ~>
		@api \posts/show do
			id: @opts.post
		.then (post) ~>
			@fetching = false
			@post = post
			@event.trigger \loaded
			resolve post

	@reply-form = null
	@reply-form-controller = riot.observable!

	@repost-form = null
	@repost-form-controller = riot.observable!

	@on \mount ~>
		_ <~ @post-promise.then
		@is-repost = @post.repost?
		@p = if @is-repost then @post.repost else @post

		if @p.text?
			tokens = @analyze @p.text
			@text.innerHTML = @compile tokens

			@text.child-nodes.for-each (e) ~>
				if e.tag-name == \MK-URL
					riot.mount e

			# URLをプレビュー
			tokens
				.filter (t) -> t.type == \link
				.map (t) ~>
					@preview = @text.append-child document.create-element \mk-url-preview
					riot.mount @preview, do
						url: t.content

		# Get likes
		@api \posts/likes do
			id: @p.id
			limit: 8
		.then (likes) ~>
			@likes = likes
			@update!

		# Get reposts
		@api \posts/reposts do
			id: @p.id
			limit: 8
		.then (reposts) ~>
			@reposts = reposts
			@update!

		# Get replies
		@api \posts/replies do
			id: @p.id
			limit: 8
		.then (replies) ~>
			@replies = replies
			@update!

		@update!

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
		if @p.is_liked
			@api \posts/likes/delete do
				post: @p.id
			.then ~>
				@p.is_liked = false
				@update!
		else
			@api \posts/likes/create do
				post: @p.id
			.then ~>
				@p.is_liked = true
				@update!

	@load-context = ~>
		@loading-context = true

		# Get context
		@api \posts/context do
			id: @p.reply_to.id
		.then (context) ~>
			@context = context.reverse!
			@loading-context = false
			@update!
