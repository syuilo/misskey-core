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

	@on \mount ~>
		document.add-event-listener \visibilitychange @window-on-visibilitychange, false
		document.add-event-listener \keydown @on-document-keydown
		window.add-event-listener \scroll @on-scroll

		@user-promise.then (user) ~>
			@user = user
			@update!

			@load ~>
				@event.trigger \loaded

	@on \unmount ~>
		document.remove-event-listener \visibilitychange @window-on-visibilitychange
		document.remove-event-listener \keydown @on-document-keydown
		window.remove-event-listener \scroll @on-scroll

	@on-document-keydown = (e) ~>
		tag = e.target.tag-name.to-lower-case!
		if tag != \input and tag != \textarea
			if e.which == 84 # t
				@controller.trigger \focus

	@load = (cb) ~>
		@api \users/posts do
			user: @user.id
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
			max: @timeline.posts[@timeline.posts.length - 1].id
		.then (posts) ~>
			@more-loading = false
			@update!
			@controller.trigger \prepend-posts posts
		.catch (err) ~>
			console.error err

	@on-stream-post = (post) ~>
		@is-empty = false
		@update!
		@controller.trigger \add-post post

		if document.hidden
			@unread-count++
			document.title = '(' + @unread-count + ') ' + @get-post-summary post

	@window-on-visibilitychange = ~>
		if !document.hidden
			@unread-count = 0
			document.title = 'Misskey'

	@on-scroll = ~>
		current = window.scroll-y + window.inner-height
		if current > document.body.offset-height - 16 # 遊び
			@more!
