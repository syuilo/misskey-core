riot = require \riot

activate = require './common/scripts/i.ls'

module.exports = (me) ~>
	activate me

	i = if me? then me._web else null

	riot.mixin \cropper do
		Cropper: require \cropper

	riot.mixin \sortable do
		Sortable: require \Sortable

	messaging-stream = (require './common/scripts/messaging-stream.ls') me
	riot.mixin \messaging-stream do
		messaging-stream: messaging-stream

	riot.mixin \is-promise do
		is-promise: require './common/scripts/is-promise.ls'

	riot.mixin \log do
		log: (require './common/scripts/log.ls').bind null me

	riot.mixin \get-post-summary do
		get-post-summary: require './common/scripts/get-post-summary.ls'

	riot.mixin \text do
		analyze: require 'misskey-text'
		compile: require './common/scripts/text-compiler.js'

	riot.mixin \get-password-strength do
		get-password-strength: require 'strength.js'

	riot.mixin \ui-progress do
		Progress: require './common/scripts/loading.ls'

	riot.mixin \api do
		api: (require './common/scripts/api.ls').bind null i

	riot.mixin \bytes-to-size do
		bytes-to-size: require './common/scripts/bytes-to-size.js'
