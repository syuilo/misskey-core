mk-post-sub(title={ title })
	article
		a.avatar-anchor(href= config.url + '/' + { post.user.username })
			img.avatar(src={ post.user.avatar_url + '?thumbnail&size=64' }, alt='avatar', data-user-preview={ post.user.id })
		div.main
			header
				div.left
					a.name(href= config.url + '/' + { post.user.username })
						| { post.user.name }
					span.username
						| @{ post.user.username }
				div.right
					a.time(href={ CONFIG.url + '/' + post.user.username + '/' + post.id })
						mk-time(time={ post.created_at })
			div.body
				mk-sub-post-content.text(post={ post })

script.
	@mixin \user-preview

	@title = 'a'
	@post = @opts.post

style.
	display block
	position relative
	margin 0
	padding 0
	font-family 'Meiryo', 'メイリオ', 'sans-serif'
	font-size 0.9em

	> article
		position relative
		padding 16px

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
			margin 0 14px 0 0

			> .avatar
				display block
				width 52px
				height 52px
				margin 0
				border-radius 8px
				vertical-align bottom

		> .main
			float left
			width calc(100% - 66px)

			> header
				margin-bottom 4px
				white-space nowrap

				> .left
					> .name
						display inline
						margin 0
						padding 0
						color #607073
						font-size 1em
						font-weight 700
						text-align left
						text-decoration none

						&:hover
							text-decoration underline

					> .username
						text-align left
						margin 0 0 0 8px
						color #d1d8da

				> .right
					position absolute
					top 16px
					right 16px

					> .time
						color #b2b8bb

			> .body

				> .text
					cursor default
					margin 0
					padding 0
					font-size 1.1em
					color #717171
