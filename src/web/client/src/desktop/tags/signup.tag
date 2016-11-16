mk-signup
	form(onsubmit={ onsubmit }, autocomplete='off')
		label.username
			p.caption
				i.fa.fa-at
				| ユーザー名
			input@username(
				type='text'
				pattern='^[a-zA-Z0-9\-]{3,20}$'
				placeholder='a~z、A~Z、0~9、-'
				autocomplete='off'
				required
				onkeyup={ on-change-username })

			p.profile-page-url-preview(if={ username.value != '' && username-state != 'invalid-format' && username-state != 'min-range' && username-state != 'max-range' }) { CONFIG.url + '/' + username.value }

			p.info(if={ username-state == 'wait' }, style='color:#999')
				i.fa.fa-fw.fa-spinner.fa-pulse
				| 確認しています...
			p.info(if={ username-state == 'ok' }, style='color:#3CB7B5')
				i.fa.fa-fw.fa-check
				| 利用できます
			p.info(if={ username-state == 'unavailable' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| 既に利用されています
			p.info(if={ username-state == 'error' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| 通信エラー
			p.info(if={ username-state == 'invalid-format' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| a~z、A~Z、0~9、-(ハイフン)が使えます
			p.info(if={ username-state == 'min-range' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| 3文字以上でお願いします！
			p.info(if={ username-state == 'max-range' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| 20文字以内でお願いします

		label.password
			p.caption
				i.fa.fa-lock
				| パスワード
			input@password(
				type='password'
				placeholder='8文字以上を推奨します'
				autocomplete='off'
				required
				onkeyup={ on-change-password })

			div.meter(if={ password-strength != '' }, data-strength={ password-strength })
				div.value@password-metar

			p.info(if={ password-strength == 'low' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| 弱いパスワード
			p.info(if={ password-strength == 'medium' }, style='color:#3CB7B5')
				i.fa.fa-fw.fa-check
				| まあまあのパスワード
			p.info(if={ password-strength == 'heigh' }, style='color:#3CB7B5')
				i.fa.fa-fw.fa-check
				| 強いパスワード

		label.retype-password
			p.caption
				i.fa.fa-lock
				| パスワード(再入力)
			input@password-retype(
				type='password'
				placeholder='確認のため再入力してください'
				autocomplete='off'
				required
				onkeyup={ on-change-password-retype })

			p.info(if={ password-retype-state == 'match' }, style='color:#3CB7B5')
				i.fa.fa-fw.fa-check
				| 確認されました
			p.info(if={ password-retype-state == 'not-match' }, style='color:#FF1161')
				i.fa.fa-fw.fa-exclamation-triangle
				| 一致していません

		label.recaptcha
			p.caption
				i.fa.fa-toggle-on(if={ recaptchaed })
				i.fa.fa-toggle-off(if={ !recaptchaed })
				| 認証
			div.g-recaptcha(
				data-callback='onRecaptchaed'
				data-expired-callback='onRecaptchaExpired'
				data-sitekey=CONFIG.recaptcha.siteKey)

		label.agree-tou
			input(
				name='agree-tou',
				type='checkbox',
				autocomplete='off',
				required)
			p
				a() 利用規約
				| に同意する

		mk-ripple-button(onclick={ onsubmit })
			| アカウント作成

style.
	display block
	box-sizing border-box
	padding 18px 32px 0 32px
	min-width 368px
	overflow hidden

	> form
		*:not(i)
			font-family 'Meiryo', 'メイリオ', 'Meiryo UI', sans-serif !important

		label
			display block
			position relative
			margin 16px 0

			> .caption
				margin 0 0 4px 0
				color #828888
				font-size 0.95em

				> i
					margin-right 0.25em
					color #96adac

			> .info
				display block
				margin 4px 0
				font-size 0.8em

				> i
					margin-right 0.3em

			&.username
				.profile-page-url-preview
					display block
					margin 4px 8px 0 4px
					font-size 0.8em
					color #888

					&:empty
						display none

					&:not(:empty) + .info
						margin-top 0

			&.password
				.meter
					display block
					margin-top 8px
					width 100%
					height 8px

					&[data-strength='']
						display none

					&[data-strength='low']
						> .value
							background #d73612

					&[data-strength='medium']
						> .value
							background #d7ca12

					&[data-strength='high']
						> .value
							background #61bb22

					> .value
						display block
						width 0%
						height 100%
						background transparent
						border-radius 4px
						transition all 0.1s ease

		[type=text], [type=password]
			appearance none
			user-select text
			display inline-block
			cursor auto
			box-sizing border-box
			padding 0 12px
			margin 0
			width 100%
			line-height 44px
			font-size 1em
			color #333 !important
			background #fff !important
			outline none
			border solid 1px rgba(0, 0, 0, 0.1)
			border-radius 4px
			box-shadow 0 0 0 114514px #fff inset
			transition all .3s ease
			font-family 'Meiryo', 'メイリオ', 'Meiryo UI', '游ゴシック', 'YuGothic', 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', sans-serif

			&:hover
				border-color rgba(0, 0, 0, 0.2)
				transition all .1s ease

			&:focus
				color $theme-color !important
				border-color $theme-color
				box-shadow 0 0 0 1024px #fff inset, 0 0 0 4px rgba($theme-color, 10%)
				transition all 0s ease

			&:disabled
				opacity 0.5

		.agree-tou
			padding 4px
			border-radius 4px

			&:hover
				background #f4f4f4

			&:active
				background #eee

			&, *
				cursor pointer

			p
				display inline
				color #555

		mk-ripple-button
			margin 20px 0 32px 0
			width 100%
			font-size 1em
			color #fff
			border-radius 3px

script.
	@mixin \api
	@mixin \get-password-strength

	@username-state = null
	@password-strength = ''
	@password-retype-state = null
	@recaptchaed = false

	window.on-recaptchaed = ~>
		@recaptchaed = true
		@update!

	window.on-recaptcha-expired = ~>
		@recaptchaed = false
		@update!

	@on \mount ~>
		head = (document.get-elements-by-tag-name \head).0
		script = document.create-element \script
			..set-attribute \src \https://www.google.com/recaptcha/api.js
		head.append-child script

	@on-change-username = ~>
		username = @username.value

		if username == ''
			@username-state = null
			@update!
			return

		err = switch
			| not username.match /^[a-zA-Z0-9\-]+$/ => \invalid-format
			| username.length < 3chars              => \min-range
			| username.length > 20chars             => \max-range
			| _                                     => null

		if err?
			@username-state = err
			@update!
		else
			@username-state = \wait
			@update!

			@api \username/available do
				username: username
			.then (result) ~>
				if result.available
					@username-state = \ok
				else
					@username-state = \unavailable
				@update!
			.catch (err) ~>
				@username-state = \error
				@update!

	@on-change-password = ~>
		password = @password.value

		if password == ''
			@password-strength = ''
			return

		strength = @get-password-strength password

		if strength > 0.3
			@password-strength = \medium
			if strength > 0.7
				@password-strength = \high
		else
			@password-strength = \low

		@password-metar.style.width = (strength * 100) + \%

	@on-change-password-retype = ~>
		password = @password.value
		retyped-password = @password-retype.value

		if retyped-password == ''
			@password-retype-state = null
			return

		if password == retyped-password
			@password-retype-state = \match
		else
			@password-retype-state = \not-match

	@onsubmit = ~>
		username = @username.value
		password = @password.value

		locker = document.body.append-child document.create-element \mk-locker

		@api CONFIG.urls.signup, do
			username: username
			password: password
			'g-recaptcha-response': grecaptcha.get-response!
		.then ~>
			@api CONFIG.urls.signin, do
				username: username
				password: password
			.then ~>
				location.href = CONFIG.url
		.catch ~>
			alert '何らかの原因によりアカウントの作成に失敗しました。再度お試しください。'

			grecaptcha.reset!
			@recaptchaed = false

			locker.parent-node.remove-child locker
