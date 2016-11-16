mk-settings-window
	mk-window(controller={ window-controller }, is-modal={ true }, width={ '700px' }, height={ '550px' })
		<yield to="header">
		i.fa.fa-cog
		| 設定
		</yield>
		<yield to="content">
		mk-settings
		</yield>

style.
	> mk-window
		[data-yield='header']
			> i
				margin-right 4px

		[data-yield='content']
			overflow auto

script.
	@controller = @opts.controller

	@window-controller = riot.observable!

	@controller.on \open ~>
		@window-controller.trigger \open

	@controller.on \close ~>
		@window-controller.trigger \close

	@window-controller.on \closed ~>
		@unmount!
