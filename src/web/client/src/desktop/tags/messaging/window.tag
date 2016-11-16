mk-messaging-window
	mk-window(controller={ window-controller }, is-modal={ false }, width={ '500px' }, height={ '560px' })
		<yield to="header">
		i.fa.fa-comments
		| メッセージ
		</yield>
		<yield to="content">
		mk-messaging(event={ parent.messaging-event })
		</yield>

style.
	> mk-window
		[data-yield='header']
			> i
				margin-right 4px

		[data-yield='content']
			> mk-messaging
				height 100%

script.
	@window-controller = riot.observable!
	@messaging-event = riot.observable!

	@on \mount ~>
		@window-controller.trigger \open

	@window-controller.on \closed ~>
		@unmount!

	@messaging-event.on \navigate-user (user) ~>
		w = document.body.append-child document.create-element \mk-messaging-room-window
		riot.mount w, do
			user: user
