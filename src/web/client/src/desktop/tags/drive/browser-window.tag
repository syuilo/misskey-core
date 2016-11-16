mk-drive-browser-window
	mk-window(controller={ window-controller }, is-modal={ false }, width={ '800px' }, height={ '500px' })
		<yield to="header">
		i.fa.fa-cloud
		| ドライブ
		</yield>
		<yield to="content">
		// Note: Riot3.0.0にしたら xmultiple を multiple に変更 (2.xでは、真理値属性と判定され__がプレフィックスされてしまう)
		mk-drive-browser(controller={ parent.browser-controller }, xmultiple={ true }, folder={ parent.folder })
		</yield>

style.
	> mk-window
		[data-yield='header']
			> i
				margin-right 4px

		[data-yield='content']
			> mk-drive-browser
				height 100%

script.
	@controller = @opts.controller

	@window-controller = riot.observable!
	@browser-controller = riot.observable!

	@folder = if @opts.folder? then @opts.folder else null

	@controller.on \open ~>
		@window-controller.trigger \open

	@controller.on \close ~>
		@window-controller.trigger \close

	@window-controller.on \closed ~>
		@unmount!
