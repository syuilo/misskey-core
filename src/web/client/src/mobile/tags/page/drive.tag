mk-drive-page
	mk-ui: mk-drive(event={ parent.event }, folder={ parent.opts.folder }, file={ parent.opts.file })

style.
	display block

script.
	@mixin \ui
	@mixin \ui-progress

	@event = riot.observable!

	@on \mount ~>
		document.title = 'Misskey Drive'
		@ui.trigger \title '<i class="fa fa-cloud"></i>ドライブ'
		@ui.trigger \bg '#fff'

	@event.on \begin-load ~>
		@Progress.start!

	@event.on \loaded-mid ~>
		@Progress.set 0.5

	@event.on \loaded ~>
		@Progress.done!

	@event.on \move-root ~>
		@ui.trigger \title '<i class="fa fa-cloud"></i>ドライブ'

		# Rewrite URL
		history.push-state null null '/i/drive'

	@event.on \cd (folder) ~>
		# TODO: escape html characters in folder.name
		@ui.trigger \title '<i class="fa fa-folder-open"></i>' + folder.name

	@event.on \move (folder) ~>
		# Rewrite URL
		history.push-state null null '/i/drive/folder/' + folder.id

	@event.on \open-file (file) ~>
		# TODO: escape html characters in file.name
		@ui.trigger \title '<mk-file-type-icon class="icon"></mk-file-type-icon>' + file.name

		# Rewrite URL
		history.push-state null null '/i/drive/file/' + file.id

		riot.mount \mk-file-type-icon do
			file: file
