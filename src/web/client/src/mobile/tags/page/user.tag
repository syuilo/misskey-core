mk-user-page
	mk-ui: mk-user(user={ parent.user }, event={ parent.event }, page={ parent.opts.page })

style.
	display block

script.
	@mixin \ui
	@mixin \ui-progress

	@user = @opts.user
	@event = riot.observable!

	@on \mount ~>
		@Progress.start!

	@event.on \loaded (user) ~>
		@Progress.done!
		document.title = user.name + ' | Misskey'
		# TODO: ユーザー名をエスケープ
		@ui.trigger \title '<i class="fa fa-user"></i>' + user.name
		@ui.trigger \bg '#fff'
