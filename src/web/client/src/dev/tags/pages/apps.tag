mk-apps-page
	h1 アプリを管理
	a(href='/app/new') アプリ作成
	p(if={ apps.length == 0 }) アプリなし
	ul.apps
		li(each={ app in apps })
			a(href={ '/app/' + app.id })
				p.name { app.name }

style.
	display block

script.
	@mixin \api

	@on \mount ~>
		@api \my/apps
		.then (apps) ~>
			@apps = apps
			@update!
