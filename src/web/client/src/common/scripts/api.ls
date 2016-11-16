riot = require \riot

spinner = null
api-stack = 0

net = riot.observable!

riot.mixin \net do
	net: net

module.exports = (i, endpoint, data) ->
	api-stack++

	if i? and typeof i == \object then i = i._web

	body = ["_i=#i"]

	for k, v of data
		if v != undefined
			v = encodeURIComponent v
			body.push "#k=#v"

	opts =
		method: \POST
		headers:
			'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		body: body.join \&

	ep = "#{CONFIG.api.url}/#{endpoint}"

	if api-stack == 1
		spinner := document.create-element \div
			..set-attribute \id \wait
		document.body.append-child spinner

	new Promise (resolve, reject) ->
		timer = set-timeout ->
			net.trigger \detected-slow-network
		, 5000ms

		fetch ep, opts
		.then (res) ->
			api-stack--
			clear-timeout timer
			if api-stack == 0
				spinner.parent-node.remove-child spinner

			if res.status == 200
				res.json!.then resolve
			else if res.status == 204
				resolve!
			else
				res.json!.then (err) ->
					reject err.error
		.catch reject
