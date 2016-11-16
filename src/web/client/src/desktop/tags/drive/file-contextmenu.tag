mk-drive-browser-file-contextmenu
	mk-contextmenu(controller={ ctx-controller }): ul
		li(onclick={ parent.rename }): p
			i.fa.fa-i-cursor
			| 名前を変更
		li(onclick={ parent.copy-url }): p
			i.fa.fa-link
			| URLをコピー
		li: a(href={ parent.file.url + '?download' }, download={ parent.file.name }, onclick={ parent.download })
			i.fa.fa-download
			| ダウンロード
		li.separator
		li(onclick={ parent.delete }): p
			i.fa.fa-trash-o
			| 削除
		li.separator
		li.has-child
			p
				| その他...
				i.fa.fa-caret-right
			ul
				li(onclick={ parent.set-avatar }): p
					| アバターに設定
				li(onclick={ parent.set-banner }): p
					| バナーに設定
				li(onclick={ parent.set-wallpaper }): p
					| 壁紙に設定
		li.has-child
			p
				| アプリで開く...
				i.fa.fa-caret-right
			ul
				li(onclick={ parent.add-app }): p
					| アプリを追加...

script.
	@mixin \api
	@mixin \i
	@mixin \update-avatar
	@mixin \update-banner
	@mixin \input-dialog
	@mixin \NotImplementedException

	@controller = @opts.controller
	@browser-controller = @opts.browser-controller
	@ctx-controller = riot.observable!
	@file = @opts.file

	@controller.on \open (pos) ~>
		@ctx-controller.trigger \open pos

	@ctx-controller.on \closed ~>
		@controller.trigger \closed
		@unmount!

	@rename = ~>
		@ctx-controller.trigger \close

		name <~ @input-dialog do
			'ファイル名の変更'
			'新しいファイル名を入力してください'
			@file.name

		@api \drive/files/update do
			file: @file.id
			name: name
		.then ~>
			# something
		.catch (err) ~>
			console.error err

	@copy-url = ~>
		@NotImplementedException!

	@download = ~>
		#@browser-controller.trigger \download @file
		@ctx-controller.trigger \close
		return true

	@set-avatar = ~>
		@ctx-controller.trigger \close
		@update-avatar @I, (i) ~>
			@update-i i
		, @file

	@set-banner = ~>
		@ctx-controller.trigger \close
		@update-banner @I, (i) ~>
			@update-i i
		, @file

	@set-wallpaper = ~>
		@NotImplementedException!

	@add-app = ~>
		@NotImplementedException!
