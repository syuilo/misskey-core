mk-idol-master-cinderella-girls-starlight-stage-information-window
	mk-window(controller={ window-controller }, is-modal={ true }, width={ '700px' }, height={ '400px' })
		<yield to="header">
		i.fa.fa-info
		| お知らせ
		</yield>
		<yield to="content">
		iframe(src= CONFIG.proxy.url + '/http://game.starlight-stage.jp/information', seamless)
		</yield>

style.
	> mk-window
		[data-yield='header']
			> i
				margin-right 8px

		[data-yield='content']
			> iframe
				width 100%
				height 100%
				overflow auto
				border none

script.
	@window-controller = riot.observable!

	@on \mount ~>
		@window-controller.trigger \open

	@window-controller.on \closed ~>
		@unmount!
