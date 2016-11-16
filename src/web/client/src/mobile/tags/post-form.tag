mk-post-form
	textarea@text(disabled={ wait }, class={ withfiles: files.length != 0 }, oninput={ update }, onkeypress={ onkeypress }, onpaste={ onpaste }, placeholder={ opts.reply ? 'この投稿への返信...' : 'いまどうしてる？' })
	div.attaches(if={ files.length != 0 })
		ul.files@attaches
			li.file(each={ files })
				div.img(style='background-image: url({ url + "?thumbnail&size=64" })', title={ name })
			li.add(if={ files.length < 4 }, title='PCからファイルを添付', onclick={ select-file }): i.fa.fa-plus
	mk-uploader(controller={ uploader-controller })
	button@upload(onclick={ select-file }): i.fa.fa-upload
	button@drive(onclick={ select-file-from-drive }): i.fa.fa-cloud
	input@file(type='file', accept='image/*', multiple, tabindex='-1', onchange={ change-file })

style.
	display block
	padding 16px
	background lighten($theme-color, 95%)

	> .attaches
		position relative
		margin 0
		padding 0
		background lighten($theme-color, 98%)
		background-clip padding-box
		border solid 1px rgba($theme-color, 0.1)
		border-top none
		border-radius 0 0 4px 4px
		transition border-color .3s ease

		> .files
			display block
			margin 0
			padding 4px
			list-style none

			&:after
				content ""
				display block
				clear both

			> .file
				display block
				position relative
				float left
				margin 4px
				padding 0
				cursor move

				&:hover > .remove
					display block

				> .img
					width 64px
					height 64px
					background-size cover
					background-position center center

				> .remove
					display none
					position absolute
					top -6px
					right -6px
					width 16px
					height 16px
					cursor pointer

			> .add
				display block
				position relative
				float left
				margin 4px
				padding 0
				border dashed 2px rgba($theme-color, 0.2)
				cursor pointer

				&:hover
					border-color rgba($theme-color, 0.3)

					> i
						color rgba($theme-color, 0.4)

				> i
					display block
					width 60px
					height 60px
					line-height 60px
					text-align center
					font-size 1.2em
					color rgba($theme-color, 0.2)

	> mk-uploader
		margin 8px 0 0 0
		padding 8px
		border solid 1px rgba($theme-color, 0.2)
		border-radius 4px

	[name='file']
		display none

	[name='text']
		display block
		box-sizing border-box
		padding 12px
		margin 0
		width 100%
		max-width 100%
		min-width 100%
		min-height calc(1em + 12px + 12px)
		font-size 1em
		color #333
		background #fff
		background-clip padding-box
		outline none
		border solid 1px rgba($theme-color, 0.1)
		border-radius 4px
		box-shadow none
		transition border-color .3s ease
		font-family 'Meiryo', 'メイリオ', 'Meiryo UI', sans-serif

		&:hover
			border-color rgba($theme-color, 0.2)
			transition border-color .1s ease

		&:focus
			color $theme-color
			border-color rgba($theme-color, 0.5)
			transition border-color 0s ease

		&:disabled
			opacity 0.5

		&::-webkit-input-placeholder
			color rgba($theme-color, 0.3)

		&.withfiles
			border-bottom solid 1px rgba($theme-color, 0.1) !important
			border-radius 4px 4px 0 0

			&:hover + .attaches
				border-color rgba($theme-color, 0.2)
				transition border-color .1s ease

			&:focus + .attaches
				border-color rgba($theme-color, 0.5)
				transition border-color 0s ease

	[name='upload']
	[name='drive']
		-webkit-appearance none
		-moz-appearance none
		appearance none
		display inline-block
		position relative
		cursor pointer
		box-sizing border-box
		padding 0
		margin 8px 4px 0 0
		width 40px
		height 40px
		font-size 1em
		color rgba($theme-color, 0.5)
		background transparent
		outline none
		border solid 1px transparent
		border-radius 4px
		box-shadow none

		&:hover
			background transparent
			border-color rgba($theme-color, 0.3)

		&:active
			color rgba($theme-color, 0.6)
			background linear-gradient(to bottom, lighten($theme-color, 80%) 0%, lighten($theme-color, 90%) 100%)
			border-color rgba($theme-color, 0.5)
			box-shadow 0 2px 4px rgba(0, 0, 0, 0.15) inset

		&:focus
			&:after
				content ""
				pointer-events none
				position absolute
				top -5px
				right -5px
				bottom -5px
				left -5px
				border 2px solid rgba($theme-color, 0.3)
				border-radius 8px

script.
	@mixin \api
	@mixin \sortable

	@wait = false
	@uploadings = []
	@files = []
	@uploader-controller = riot.observable!
	@controller = @opts.controller
	@event = @opts.event

	@on \mount ~>
		@text.focus!

	@onkeypress = (e) ~>
		if (e.char-code == 10 || e.char-code == 13) && e.ctrl-key
			@post!
		else
			return true

	@onpaste = (e) ~>
		data = e.clipboard-data
		items = data.items
		for i from 0 to items.length - 1
			item = items[i]
			switch (item.kind)
				| \file =>
					@upload item.get-as-file!
		return true

	@select-file = ~>
		@file.click!

	@select-file-from-drive = ~>
		browser = document.body.append-child document.create-element \mk-drive-selector
		riot.mount browser, do
			multiple: true
			callback: (files) ~>
				files.for-each @add-file

	@change-file = ~>
		files = @file.files
		for i from 0 to files.length - 1
			file = files.item i
			@upload file

	@upload = (file) ~>
		@uploader-controller.trigger \upload file

	@uploader-controller.on \uploaded (file) ~>
		@add-file file

	@uploader-controller.on \change-uploads (uploads) ~>
		@event.trigger \change-uploading-files uploads

	@add-file = (file) ~>
		file._remove = ~>
			@files = @files.filter (x) -> x.id != file.id
			@event.trigger \change-files @files
			@update!

		@files.push file
		@event.trigger \change-files @files
		@update!

		new @Sortable @attaches, do
			draggable: \.file
			animation: 150ms

	@controller.on \post ~>
		@post!

	@post = ~>
		@wait = true
		@event.trigger \before-post

		files = if @files? and @files.length > 0
			then @files.map (f) -> f.id
			else undefined

		@api \posts/create do
			text: @text.value
			images: files
			reply_to: if @opts.reply? then @opts.reply.id else undefined
		.then (data) ~>
			@event.trigger \post
			#@opts.ui.trigger \notification '投稿しました。'
		.catch (err) ~>
			console.error err
			#@opts.ui.trigger \notification 'Error!'
		.then ~>
			@wait = false
			@event.trigger \after-post
			@update!
