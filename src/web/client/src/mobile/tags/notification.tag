mk-notification(class={ notification.type })
	mk-time(time={ notification.created_at })

	div.main(if={ notification.type == 'like' })
		a.avatar-anchor(href={ CONFIG.url + '/' + notification.user.username })
			img.avatar(src={ notification.user.avatar_url + '?thumbnail&size=64' }, alt='avatar')
		div.text
			p
				i.fa.fa-thumbs-o-up
				a(href= config.url + '/' + { notification.user.username }) { notification.user.name }
			a.post-preview(href={ CONFIG.url + '/' + notification.post.user.username + '/' + notification.post.id }) { get-post-summary(notification.post) }

	div.main(if={ notification.type == 'repost' })
		a.avatar-anchor(href={ CONFIG.url + '/' + notification.post.user.username })
			img.avatar(src={ notification.post.user.avatar_url + '?thumbnail&size=64' }, alt='avatar')
		div.text
			p
				i.fa.fa-retweet
				a(href= config.url + '/' + { notification.post.user.username }) { notification.post.user.name }
			a.post-preview(href={ CONFIG.url + '/' + notification.post.user.username + '/' + notification.post.id }) { get-post-summary(notification.post.repost) }

	div.main(if={ notification.type == 'follow' })
		a.avatar-anchor(href={ CONFIG.url + '/' + notification.user.username })
			img.avatar(src={ notification.user.avatar_url + '?thumbnail&size=64' }, alt='avatar')
		div.text
			p
				i.fa.fa-user-plus
				a(href= config.url + '/' + { notification.user.username }) { notification.user.name }

	div.main(if={ notification.type == 'mention' })
		a.avatar-anchor(href={ CONFIG.url + '/' + notification.post.user.username })
			img.avatar(src={ notification.post.user.avatar_url + '?thumbnail&size=64' }, alt='avatar')
		div.text
			p
				i.fa.fa-reply
				a(href= config.url + '/' + { notification.post.user.username }) { notification.post.user.name }
			a.post-preview(href={ CONFIG.url + '/' + notification.post.user.username + '/' + notification.post.id }) { get-post-summary(notification.post) }

style.
	display block
	position relative
	margin 0
	padding 16px

	> mk-time
		display inline
		position absolute
		top 16px
		right 12px
		vertical-align top
		color rgba(0, 0, 0, 0.6)
		font-size 12px

	> .main
		word-wrap break-word

	&:after
		content ""
		display block
		clear both

	.avatar-anchor
		display block
		float left

		img
			min-width 36px
			min-height 36px
			max-width 36px
			max-height 36px
			border-radius 6px

	.text
		float right
		box-sizing border-box
		width calc(100% - 36px)
		padding-left 8px

		p
			margin 0

			i
				margin-right 4px

	&.like, &.repost
		.post-preview
			color rgba(0, 0, 0, 0.7)

			&:before, &:after
				font-family FontAwesome
				font-size 1em
				font-weight normal
				font-style normal
				display inline-block
				margin-right 3px

			&:before
				content "\f10d"

			&:after
				content "\f10e"

	&.like
		.text p i
			color #FFAC33

	&.repost
		.text p i
			color #77B255

	&.follow
		.text p i
			color #53c7ce

	&.mention
		.text p i
			color #555

		.post-preview
			color rgba(0, 0, 0, 0.7)

script.
	@mixin \get-post-summary
	@notification = @opts.notification
