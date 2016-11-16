mk-user-page
	mk-ui: mk-user(user={ parent.user }, event={ parent.event }, page={ parent.opts.page })

style.
	display block

script.
	@mixin \ui-progress

	@user = @opts.user
	@event = riot.observable!

	@on \mount ~>
		@Progress.start!

	@event.on \user-fetched (user) ~>
		@Progress.set 0.5
		document.title = user.name + ' | Misskey'

	@event.on \loaded ~>
		@Progress.done!
