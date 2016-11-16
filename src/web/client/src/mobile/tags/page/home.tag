mk-home-page
	mk-ui: mk-home(event={ event })

style.
	display block

script.
	@mixin \i
	@mixin \ui
	@mixin \ui-progress
	@mixin \stream
	@mixin \get-post-summary

	@event = riot.observable!
	@unread-count = 0

	@on \mount ~>
		document.title = 'Misskey'
		@ui.trigger \title '<i class="fa fa-home"></i>ホーム'
		@ui.trigger \bg '#f9f9f9'

		@Progress.start!

		@stream.on \post @on-stream-post
		document.add-event-listener \visibilitychange @window-on-visibilitychange, false

	@on \unmount ~>
		@stream.off \post @on-stream-post
		document.remove-event-listener \visibilitychange @window-on-visibilitychange

	@event.on \loaded ~>
		@Progress.done!

	@on-stream-post = (post) ~>
		if document.hidden and post.user.id !== @I.id
			@unread-count++
			document.title = '(' + @unread-count + ') ' + @get-post-summary post

	@window-on-visibilitychange = ~>
		if !document.hidden
			@unread-count = 0
			document.title = 'Misskey'
