mk-user-profile
	div.friend-form(if={ SIGNIN && I.id != user.id })
		mk-big-follow-button(user={ user-promise })
		p.followed(if={ user.is_followed }) フォローされています
	div.bio(if={ user.bio != '' }) { user.bio }
	div.friends
		p.following
			i.fa.fa-angle-right
			a { user.following_count }
			| 人を
			b フォロー
		p.followers
			i.fa.fa-angle-right
			a { user.followers_count }
			| 人の
			b フォロワー

style.
	position relative
	background #fff

	> *:first-child
		border-top none !important

	> .friend-form
		padding 16px
		border-top solid 1px #eee

		> mk-big-follow-button
			width 100%

		> .followed
			margin 12px 0 0 0
			padding 0
			text-align center
			line-height 24px
			font-size 0.8em
			color #71afc7
			background #eefaff
			border-radius 4px

	> .bio
		padding 16px
		color #555
		border-top solid 1px #eee
	
	> .friends
		padding 16px
		color #555
		border-top solid 1px #eee

		> p
			margin 8px 0

			> i
				margin-left 8px
				margin-right 8px

script.
	@mixin \is-promise

	@user = null
	@user-promise = if @is-promise @opts.user then @opts.user else Promise.resolve @opts.user

	@on \mount ~>
		@user-promise.then (user) ~>
			@user = user
			@update!
