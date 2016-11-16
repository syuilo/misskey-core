# Router
#================================

riot = require \riot
route = require \page
page = null

module.exports = (me) ~>

	# Routing
	#--------------------------------

	route \/ index
	route \/i/notifications notifications
	route \/i/drive drive
	route \/i/drive/folder/:folder drive
	route \/i/drive/file/:file drive
	route \/search::query search
	route \/:user user.bind null \posts
	route \/:user/graphs user.bind null \graphs
	route \/:user/:post post
	route \* not-found

	# Handlers
	#--------------------------------

	function index
		if me? then home! else entrance!

	function home
		mount document.create-element \mk-home-page

	function entrance
		mount document.create-element \mk-entrance

	function notifications
		mount document.create-element \mk-notifications-page

	function search ctx
		document.create-element \mk-search-page
			..set-attribute \query ctx.params.query
			.. |> mount

	function user page, ctx
		document.create-element \mk-user-page
			..set-attribute \user ctx.params.user
			..set-attribute \page page
			.. |> mount

	function post ctx
		document.create-element \mk-post-page
			..set-attribute \post ctx.params.post
			.. |> mount

	function drive ctx
		p = document.create-element \mk-drive-page
		if ctx.params.folder then p.set-attribute \folder ctx.params.folder
		if ctx.params.file then p.set-attribute \file ctx.params.file
		mount p

	function not-found
		mount document.create-element \mk-not-found

	# Register mixin
	#--------------------------------

	riot.mixin \page do
		page: route

	# Exec
	#--------------------------------

	route!

# Mount
#================================

function mount content
	if page? then page.unmount!
	body = document.get-element-by-id \app
	page := riot.mount body.append-child content .0
