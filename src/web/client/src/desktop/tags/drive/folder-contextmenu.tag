mk-drive-browser-folder-contextmenu
	mk-contextmenu(controller={ ctx-controller }): ul
		li(onclick={ parent.move }): p
			i.fa.fa-arrow-right
			| このフォルダへ移動
		li(onclick={ parent.new-window }): p
			i.fa.fa-share-square-o
			| 新しいウィンドウで表示
		li.separator
		li(onclick={ parent.rename }): p
			i.fa.fa-i-cursor
			| 名前を変更
		li.separator
		li(onclick={ parent.delete }): p
			i.fa.fa-trash-o
			| 削除

script.
	@controller = @opts.controller
	@browser-controller = @opts.browser-controller
	@ctx-controller = riot.observable!
	@folder = @opts.folder

	@controller.on \open (pos) ~>
		@ctx-controller.trigger \open pos

	@ctx-controller.on \closed ~>
		@controller.trigger \closed
		@unmount!

	@move = ~>
		@browser-controller.trigger \move @folder.id
		@ctx-controller.trigger \close

	@new-window = ~>
		@browser-controller.trigger \new-window @folder.id
		@ctx-controller.trigger \close

	@create-folder = ~>
		@browser-controller.trigger \create-folder
		@ctx-controller.trigger \close

	@upload = ~>
		@browser-controller.trigger \upload
		@ctx-controller.trigger \close
