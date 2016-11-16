# Update Avatar
#================================

riot = require 'riot'
dialog = require './dialog.ls'
api = require '../../common/scripts/api.ls'

module.exports = (I, cb, file = null) ~>

	@file-selected = (file) ~>
		cropper = document.body.append-child document.create-element \mk-crop-window
		cropper-controller = riot.observable!
		riot.mount cropper, do
			file: file
			title: 'アバターとして表示する部分を選択'
			aspect-ratio: 1 / 1
			controller: cropper-controller
		cropper-controller.trigger \open
		cropper-controller.on \cropped (blob) ~>
			data = new FormData!
			data.append \_i I._web
			data.append \file blob, file.name + '.cropped.png'
			api I, \drive/folders/find do
				name: 'アイコン'
			.then (icon-folder) ~>
				if icon-folder.length == 0
					api I, \drive/folders/create do
						name: 'アイコン'
					.then (icon-folder) ~>
						@uplaod data, icon-folder
				else
					@uplaod data, icon-folder.0
		cropper-controller.on \skiped ~>
			@set file

	@uplaod = (data, folder) ~>

		progress = document.body.append-child document.create-element \mk-progress-dialog
		progress-controller = riot.observable!
		riot.mount progress, do
			title: '新しいアバターをアップロードしています'
			controller: progress-controller

		if folder?
			data.append \folder folder.id

		xhr = new XMLHttpRequest!
		xhr.open \POST CONFIG.api.url + \/drive/files/create true
		xhr.onload = (e) ~>
			file = JSON.parse e.target.response
			progress-controller.trigger \close
			@set file

		xhr.upload.onprogress = (e) ~>
			if e.length-computable
				progress-controller.trigger \update e.loaded, e.total

		xhr.send data

	@set = (file) ~>
		api I, \i/update do
			avatar: file.id
		.then (i) ~>
			dialog do
				'<i class="fa fa-info-circle"></i>アバターを更新しました'
				'新しいアバターが反映されるまで時間がかかる場合があります。'
				[
					text: \わかった
				]
			if cb? then cb i
		.catch (err) ~>
			console.error err
			#@opts.ui.trigger \notification 'Error!'

	if file?
		@file-selected file
	else
		browser = document.body.append-child document.create-element \mk-select-file-from-drive-window
		browser-controller = riot.observable!
		riot.mount browser, do
			multiple: false
			controller: browser-controller
			title: '<i class="fa fa-picture-o"></i>アバターにする画像を選択'
		browser-controller.trigger \open
		browser-controller.one \selected (file) ~>
			@file-selected file
