#================================
# Fetch me
#================================

riot = require \riot

api = require './common/scripts/api.ls'
generate-default-userdata = require './common/scripts/generate-default-userdata.ls'

fetchme = (_i, cb) ~>
	me = null

	if not _i?
		return done!

	# ユーザー情報フェッチ
	fetch "#{CONFIG.api.url}/i" do
		method: \POST
		headers:
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		body: "_i=#_i"
	.then (res) ~>
		if res.status != 200
			alert 'ユーザー認証に失敗しました。ログアウトします。'
			location.href = CONFIG.urls.signout
			return

		i <~ res.json!.then
		me := i
		me._web = _i

		# initialize it if user data is empty
		if me.data?
			done!
		else
			init!
	.catch (e) ~>
		console.error e
		info = document.create-element \mk-core-error
			|> document.body.append-child
		riot.mount info, do
			retry: ~> fetchme _i, cb

	function done
		if cb? then cb me

	function init
		data = generate-default-userdata!

		api _i, \i/appdata/set do
			data: JSON.stringify data
		.then ~>
			me.data = data
			done!

module.exports = fetchme
