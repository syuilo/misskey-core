# Stream
#================================

stream = require '../../common/scripts/stream.ls'
riot = require \riot

function init me
	s = stream me

	s.event.on \drive_file_created (file) ~>
		n = new Notification 'ファイルがアップロードされました' do
			body: file.name
			icon: file.url + '?thumbnail&size=64'
		set-timeout (n.close.bind n), 5000ms

	riot.mixin \stream do
		stream: s.event
		get-stream-state: s.get-state
		stream-state-ev: s.state-ev

# Export
#--------------------------------

module.exports = init
