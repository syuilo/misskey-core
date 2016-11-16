mk-notifications-page
	mk-ui: mk-notifications(event={ event })

style.
	display block

script.
	@mixin \ui
	@mixin \ui-progress

	@event = riot.observable!

	@on \mount ~>
		document.title = 'Misskey | 通知'
		@ui.trigger \title '<i class="fa fa-bell-o"></i>通知'
		@ui.trigger \bg '#f9f9f9'

		@Progress.start!

	@event.on \loaded ~>
		@Progress.done!
