mk-search-posts
	div.loading(if={ is-loading })
		mk-ellipsis-icon
	p.empty(if={ is-empty })
		i.fa.fa-search
		| 「{ query }」に関する投稿は見つかりませんでした。
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
	@mixin \get-post-summary

	@query = @opts.query
	@is-loading = true
	@is-empty = false
	@more-loading = false
	@page = 0
	@controller = riot.observable!
	@timeline = @tags[\mk-timeline]
	@event = @opts.event

	@on \mount ~>
		window.add-event-listener \scroll @on-scroll

		@api \posts/search do
			query: @query
		.then (posts) ~>
			@is-loading = false
			@is-empty = posts.length == 0
			@update!
			@controller.trigger \set-posts posts
			@event.trigger \loaded
		.catch (err) ~>
			console.error err

	@on \unmount ~>
		window.remove-event-listener \scroll @on-scroll

	@more = ~>
		if @more-loading or @is-loading or @timeline.posts.length == 0
			return
		@more-loading = true
		@update!
		@api \posts/search do
			query: @query
			page: @page + 1
		.then (posts) ~>
			@more-loading = false
			@page++
			@update!
			@controller.trigger \prepend-posts posts
		.catch (err) ~>
			console.error err

	@on-scroll = ~>
		current = window.scroll-y + window.inner-height
		if current > document.body.offset-height
			@more!
