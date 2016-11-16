mk-drive
	nav
		p(onclick={ go-root })
			i.fa.fa-cloud
			| ドライブ
		virtual(each={ folder in hierarchy-folders })
			span: i.fa.fa-angle-right
			p(onclick={ _move }) { folder.name }
		span(if={ folder != null }): i.fa.fa-angle-right
		p(if={ folder != null }) { folder.name }
	div.browser(if={ file == null }, class={ loading: loading })
		div.folders(if={ folders.length > 0 })
			virtual(each={ folder in folders })
				mk-drive-folder(folder={ folder })
			p(if={ more-folders })
				| もっと読み込む
		div.files(if={ files.length > 0 })
			virtual(each={ file in files })
				mk-drive-file(file={ file })
			p(if={ more-files })
				| もっと読み込む
		div.empty(if={ files.length == 0 && folders.length == 0 && !loading })
			p(if={ !folder == null })
				| ドライブには何もありません。
			p(if={ folder != null })
				| このフォルダーは空です
		div.loading(if={ loading }).
			<div class="spinner">
				<div class="dot1"></div>
				<div class="dot2"></div>
			</div>
	mk-drive-file-viewer(if={ file != null }, file={ file })

style.
	display block
	background #fff

	> nav
		display block
		box-sizing border-box
		width 100%
		padding 10px 12px
		overflow auto
		white-space nowrap
		font-size 0.9em
		color #555
		background #fff
		border-bottom solid 1px #dfdfdf

		> p
			display inline
			margin 0
			padding 0

			&:last-child
				font-weight bold

			> i
				margin-right 4px

		> span
			margin 0 8px
			opacity 0.5

	> .browser
		&.loading
			opacity 0.5

		> .folders
			> mk-drive-folder
				border-bottom solid 1px #eee

		> .files
			> mk-drive-file
				border-bottom solid 1px #eee

		> .empty
			padding 16px
			text-align center
			color #999
			pointer-events none

			> p
				margin 0

		> .loading
			.spinner
				margin 100px auto
				width 40px
				height 40px
				position relative
				text-align center

				-webkit-animation sk-rotate 2.0s infinite linear
				animation sk-rotate 2.0s infinite linear

			.dot1, .dot2
				width 60%
				height 60%
				display inline-block
				position absolute
				top 0
				background-color rgba(0, 0, 0, 0.3)
				border-radius 100%

				-webkit-animation sk-bounce 2.0s infinite ease-in-out
				animation sk-bounce 2.0s infinite ease-in-out

			.dot2
				top auto
				bottom 0
				-webkit-animation-delay -1.0s
				animation-delay -1.0s

			@-webkit-keyframes sk-rotate { 100% { -webkit-transform: rotate(360deg) }}
			@keyframes sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}

			@-webkit-keyframes sk-bounce {
				0%, 100% { -webkit-transform: scale(0.0) }
				50% { -webkit-transform: scale(1.0) }
			}

			@keyframes sk-bounce {
				0%, 100% {
					transform: scale(0.0);
					-webkit-transform: scale(0.0);
				} 50% {
					transform: scale(1.0);
					-webkit-transform: scale(1.0);
				}
			}

script.
	@mixin \api
	@mixin \stream

	@files = []
	@folders = []
	@hierarchy-folders = []
	@selected-files = []

	# 現在の階層(フォルダ)
	# * null でルートを表す
	@folder = null

	@file = null

	@event = @opts.event

	@is-select-mode = @opts.select? and @opts.select
	# Note: Riot3.0.0にしたら xmultiple を multiple に変更 (2.xでは、真理値属性と判定され__がプレフィックスされてしまう)
	@multiple = if @opts.xmultiple? then @opts.xmultiple else false

	@on \mount ~>
		@stream.on \drive_file_created @on-stream-drive-file-created
		@stream.on \drive_file_updated @on-stream-drive-file-updated
		@stream.on \drive_folder_created @on-stream-drive-folder-created
		@stream.on \drive_folder_updated @on-stream-drive-folder-updated

		if @opts.folder?
			@cd @opts.folder
		else
			@load!

	@on \unmount ~>
		@stream.off \drive_file_created @on-stream-drive-file-created
		@stream.off \drive_file_updated @on-stream-drive-file-updated
		@stream.off \drive_folder_created @on-stream-drive-folder-created
		@stream.off \drive_folder_updated @on-stream-drive-folder-updated

	@on-stream-drive-file-created = (file) ~>
		@add-file file, true

	@on-stream-drive-file-updated = (file) ~>
		current = if @folder? then @folder.id else null
		updated-file-parent = if file.folder? then file.folder else null
		if current != updated-file-parent
			@remove-file file
		else
			@add-file file, true

	@on-stream-drive-folder-created = (folder) ~>
		@add-folder folder, true

	@on-stream-drive-folder-updated = (folder) ~>
		current = if @folder? then @folder.id else null
		updated-folder-parent = if folder.folder? then folder.folder else null
		if current != updated-folder-parent
			@remove-folder folder
		else
			@add-folder folder, true

	@_move = (ev) ~>
		@move ev.item.folder

	@move = (target-folder) ~>
		@cd target-folder, true

	@cd = (target-folder, is-move) ~>
		if target-folder? and typeof target-folder == \object
			target-folder = target-folder.id

		if target-folder == null
			@go-root!
			return

		@loading = true
		@update!

		@api \drive/folders/show do
			folder: target-folder
		.then (folder) ~>
			@folder = folder
			@hierarchy-folders = []

			x = (f) ~>
				@hierarchy-folders.unshift f
				if f.folder?
					x f.folder

			if folder.folder?
				x folder.folder

			@update!
			if is-move then @event.trigger \move @folder
			@event.trigger \cd @folder
			@load!
		.catch (err, text-status) ->
			console.error err

	@add-folder = (folder, unshift = false) ~>
		current = if @folder? then @folder.id else null
		addee-parent = if folder.folder? then folder.folder else null
		if current != addee-parent
			return

		if (@folders.some (f) ~> f.id == folder.id)
			return

		if unshift
			@folders.unshift folder
		else
			@folders.push folder

		@update!

	@add-file = (file, unshift = false) ~>
		current = if @folder? then @folder.id else null
		addee-parent = if file.folder? then file.folder else null
		if current != addee-parent
			return

		if (@files.some (f) ~> f.id == file.id)
			exist = (@files.map (f) -> f.id).index-of file.id
			@files[exist] = file
			@update!
			return

		if unshift
			@files.unshift file
		else
			@files.push file

		@update!

	@remove-folder = (folder) ~>
		if typeof folder == \object
			folder = folder.id
		@folders = @folders.filter (f) -> f.id != folder
		@update!

	@remove-file = (file) ~>
		if typeof file == \object
			file = file.id
		@files = @files.filter (f) -> f.id != file
		@update!

	@go-root = ~>
		if @folder != null
			@folder = null
			@hierarchy-folders = []
			@update!
			@event.trigger \move-root
			@load!

	@load = ~>
		@folders = []
		@files = []
		@more-folders = false
		@more-files = false
		@loading = true
		@update!

		@event.trigger \begin-load

		load-folders = null
		load-files = null

		folders-max = 20
		files-max = 20

		# フォルダ一覧取得
		@api \drive/folders do
			folder: if @folder? then @folder.id else null
			limit: folders-max + 1
		.then (folders) ~>
			if folders.length == folders-max + 1
				@more-folders = true
				folders.pop!
			load-folders := folders
			complete!
		.catch (err, text-status) ~>
			console.error err

		# ファイル一覧取得
		@api \drive/files do
			folder: if @folder? then @folder.id else null
			limit: files-max + 1
		.then (files) ~>
			if files.length == files-max + 1
				@more-files = true
				files.pop!
			load-files := files
			complete!
		.catch (err, text-status) ~>
			console.error err

		flag = false
		complete = ~>
			if flag
				load-folders.for-each (folder) ~>
					@add-folder folder
				load-files.for-each (file) ~>
					@add-file file
				@loading = false
				@update!

				@event.trigger \loaded
			else
				flag := true
				@event.trigger \load-mid

	@choose-file = (file) ~>
		if @is-select-mode
			exist = @selected-files.some (f) ~> f.id == file.id
			if exist
				@selected-files = (@selected-files.filter (f) ~> f.id != file.id)
			else
				@selected-files.push file
			@update!
			@event.trigger \change-selected @selected-files
		else
			@file = file
			@update!
			@event.trigger \open-file @file
