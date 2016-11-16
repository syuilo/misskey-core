mk-drive-browser-folder(data-is-contextmenu-showing={ is-contextmenu-showing }, data-draghover={ draghover }, onclick={ onclick }, onmouseover={ onmouseover }, onmouseout={ onmouseout }, ondragover={ ondragover }, ondragenter={ ondragenter }, ondragleave={ ondragleave }, ondrop={ ondrop }, oncontextmenu={ oncontextmenu }, draggable='true', ondragstart={ ondragstart }, ondragend={ ondragend }, title={ title })
	p.name
		i.fa.fa-fw(class={ fa-folder-o: !hover, fa-folder-open-o: hover })
		| { folder.name }

style.
	display block
	position relative
	box-sizing border-box
	margin 4px
	padding 8px
	width 144px
	height 64px
	background lighten($theme-color, 95%)
	border-radius 4px

	&, *
		cursor pointer

	*
		pointer-events none

	&:hover
		background lighten($theme-color, 90%)

	&:active
		background lighten($theme-color, 85%)

	&[data-is-contextmenu-showing]
	&[data-draghover]
		&:after
			content ""
			pointer-events none
			position absolute
			top -4px
			right -4px
			bottom -4px
			left -4px
			border 2px dashed rgba($theme-color, 0.3)
			border-radius 4px

	&[data-draghover]
		background lighten($theme-color, 90%)

	> .name
		margin 0
		font-size 0.9em
		color darken($theme-color, 30%)

		> i
			margin-right 4px
		  margin-left 2px
			text-align left

script.
	@mixin \api
	@mixin \dialog

	@folder = @opts.folder
	@browser = @parent

	@title = @folder.name
	@hover = false

	@onclick = ~>
		@browser.move @folder

	@onmouseover = ~>
		@hover = true

	@onmouseout = ~>
		@hover = false

	@ondragover = (e) ~>
		e.stop-propagation!
		# 自分自身がドラッグされていない場合
		if !@is-dragging
			# ドラッグされてきたものがファイルだったら
			if e.data-transfer.effect-allowed == \all
				e.data-transfer.drop-effect = \copy
			else
				e.data-transfer.drop-effect = \move
		else
			# 自分自身にはドロップさせない
			e.data-transfer.drop-effect = \none
		return false

	@ondragenter = ~>
		if !@is-dragging
			@draghover = true

	@ondragleave = ~>
		@draghover = false

	@ondrop = (e) ~>
		e.stop-propagation!
		@draghover = false

		# ファイルだったら
		if e.data-transfer.files.length > 0
			Array.prototype.for-each.call e.data-transfer.files, (file) ~>
				@browser.upload file, @folder
			return false

		# データ取得
		data = e.data-transfer.get-data 'text'
		if !data?
			return false

		# パース
		obj = JSON.parse data

		# (ドライブの)ファイルだったら
		if obj.type == \file
			file = obj.id
			@browser.remove-file file
			@api \drive/files/update do
				file: file
				folder: @folder.id
			.then ~>
				# something
			.catch (err, text-status) ~>
				console.error err

		# (ドライブの)フォルダーだったら
		else if obj.type == \folder
			folder = obj.id
			# 移動先が自分自身ならreject
			if folder == @folder.id
				return false
			@browser.remove-folder folder
			@api \drive/folders/update do
				folder: folder
				parent: @folder.id
			.then ~>
				# something
			.catch (err) ~>
				if err == 'detected-circular-definition'
					@dialog do
						'<i class="fa fa-exclamation-triangle"></i>操作を完了できません'
						'移動先のフォルダーは、移動するフォルダーのサブフォルダーです。'
						[
							text: \OK
						]

		return false

	@ondragstart = (e) ~>
		e.data-transfer.effect-allowed = \move
		e.data-transfer.set-data 'text' JSON.stringify do
			type: \folder
			id: @folder.id
		@is-dragging = true

		# 親ブラウザに対して、ドラッグが開始されたフラグを立てる
		# (=あなたの子供が、ドラッグを開始しましたよ)
		@browser.is-drag-source = true

	@ondragend = (e) ~>
		@is-dragging = false
		@browser.is-drag-source = false

	@oncontextmenu = (e) ~>
		e.stop-immediate-propagation!
		@is-contextmenu-showing = true
		@update!
		ctx = document.body.append-child document.create-element \mk-drive-browser-folder-contextmenu
		ctx-controller = riot.observable!
		riot.mount ctx, do
			controller: ctx-controller
			browser-controller: @browser.controller
			folder: @folder
		ctx-controller.trigger \open do
			x: e.page-x - window.page-x-offset
			y: e.page-y - window.page-y-offset
		ctx-controller.on \closed ~>
			@is-contextmenu-showing = false
			@update!
		return false
