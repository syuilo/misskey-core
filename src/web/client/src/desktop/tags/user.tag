mk-user
	div.user(if={ !fetching })
		header
			mk-user-header(user={ user-promise })
		div.body
			mk-user-home(if={ page == 'home' }, user={ user-promise }, event={ content-event })
			mk-user-graphs(if={ page == 'graphs' }, user={ user-promise }, event={ content-event })

style.
	display block
	background #fbfbfb

	> .user
		> header
			box-sizing border-box
			max-width 560px + 270px
			margin 0 auto
			padding 0 16px

			> mk-user-header
				border solid 1px rgba(0, 0, 0, 0.075)
				border-top none
				border-radius 0 0 6px 6px
				overflow hidden

		> .body
			box-sizing border-box
			max-width 560px + 270px
			margin 0 auto
			padding 0 16px

script.
	@mixin \api

	@event = @opts.event
	@username = @opts.user
	@page = if @opts.page? then @opts.page else \home
	@fetching = true
	@content-event = riot.observable!

	@user-promise = new Promise (resolve, reject) ~>
		@api \users/show do
			username: @username
		.then (user) ~>
			@fetching = false
			@update!
			@event.trigger \user-fetched user
			resolve user

	@content-event.on \loaded ~>
		@event.trigger \loaded
