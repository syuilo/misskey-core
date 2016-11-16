mk-messaging-room-window
	mk-window(controller={ window-controller }, is-modal={ false }, width={ '500px' }, height={ '560px' })
		<yield to="header">
		i.fa.fa-comments
		| メッセージ: { parent.user.name }
		</yield>
		<yield to="content">
		mk-messaging-room(user={ parent.user })
		</yield>

style.
	> mk-window
		[data-yield='header']
			> i
				margin-right 4px

		[data-yield='content']
			> mk-messaging-room
				height 100%

script.
	@window-controller = riot.observable!
	@user = @opts.user

	@on \mount ~>
		@window-controller.trigger \open

	@window-controller.on \closed ~>
		@unmount!
