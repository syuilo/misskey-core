mk-post-form-window

	mk-window(controller={ window-controller }, is-modal={ true }, colored={ true })

		<yield to="header">
		span(if={ !parent.opts.reply }) 新規投稿
		span(if={ parent.opts.reply }) 返信
		span.files(if={ parent.files.length != 0 }) 添付: { parent.files.length }ファイル
		span.uploading-files(if={ parent.uploading-files.length != 0 })
			| { parent.uploading-files.length }個のファイルをアップロード中
			mk-ellipsis
		</yield>

		<yield to="content">
		div.ref(if={ parent.opts.reply })
			mk-post-preview(post={ parent.opts.reply })
		div.body
			mk-post-form(controller={ parent.form-controller }, reply={ parent.opts.reply })
		</yield>

style.
	> mk-window

		[data-yield='header']
			> .files
			> .uploading-files
				margin-left 8px
				opacity 0.8

				&:before
					content '('

				&:after
					content ')'

		[data-yield='content']
			> .ref
				> mk-post-preview
					margin 16px 22px

script.
	@is-open = false
	@wait = false

	@uploading-files = []
	@files = []

	@controller = @opts.controller
	@window-controller = riot.observable!
	@form-controller = riot.observable!

	@controller.on \toggle ~>
		@toggle!

	@controller.on \open ~>
		@open!

	@controller.on \close ~>
		@close!

	@window-controller.on \opening ~>
		@is-open = true
		@controller.trigger \opening

	@window-controller.on \closing ~>
		@is-open = false
		@controller.trigger \closing

	@form-controller.on \post ~>
		@close!

	@form-controller.on \change-uploading-files (files) ~>
		@uploading-files = files
		@update!

	@form-controller.on \change-files (files) ~>
		@files = files
		@update!

	@toggle = ~>
		if @is-open
			@close!
		else
			@open!

	@open = ~>
		@window-controller.trigger \open
		@form-controller.trigger \focus

	@close = ~>
		@window-controller.trigger \close
