mk-user-timeline
	div.loading(if={ is-loading })
		mk-ellipsis-icon
	p.empty(if={ is-empty })
		i.fa.fa-comments-o
		| このユーザーはまだ何も投稿していないようです。
	mk-timeline(controller={ controller })
		<yield to="footer">
		i.fa.fa-moon-o(if={ !parent.more-loading })
		i.fa.fa-spinner.fa-pulse.fa-fw(if={ parent.more-loading })
		</yield>

style.
	display block
	max-width 600px
	margin 0 auto
	background #fff

	> .loading
		padding 64px 0

	> .empty
		display block
		margin 0 auto
		padding 32px
		max-width 400px
		text-align center
		color #999

		> i
			display block
			margin-bottom 16px
			font-size 3em
			color #ccc

script.
	@mixin \api
	@mixin \is-promise
	@mixin \get-post-summary

	@user = null
	@user-promise = if @is-promise @opts.user then @opts.user else Promise.resolve @opts.user
	@is-loading = true
	@is-empty = false
	@more-loading = false
	@unread-count = 0
	@controller = riot.observable!
	@timeline = @tags[\mk-timeline]
	@event = @opts.event
	@with-media = @opts.with-media

	@on \mount ~>
		window.add-event-listener \scroll @on-scroll

		@user-promise.then (user) ~>
			@user = user
			@update!

			@load ~>
				@event.trigger \loaded

	@on \unmount ~>
		window.remove-event-listener \scroll @on-scroll

	@load = (cb) ~>
		@api \users/posts do
			user: @user.id
			with_images: @with-media
		.then (posts) ~>
			@is-loading = false
			@is-empty = posts.length == 0
			@update!
			@controller.trigger \set-posts posts
			if cb? then cb!
		.catch (err) ~>
			console.error err
			if cb? then cb!

	@more = ~>
		if @more-loading or @is-loading or @timeline.posts.length == 0
			return
		@more-loading = true
		@update!
		@api \users/posts do
			user: @user.id
			with_images: @with-media
			max: @timeline.posts[@timeline.posts.length - 1].id
		.then (posts) ~>
			@more-loading = false
			@update!
			@controller.trigger \prepend-posts posts
		.catch (err) ~>
			console.error err

	@on-scroll = ~>
		current = window.scroll-y + window.inner-height
		if current > document.body.offset-height
			@more!
