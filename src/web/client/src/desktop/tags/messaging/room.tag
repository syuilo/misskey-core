mk-messaging-room
	header(if={ group }): div.container
		div.kyoppie
			h1 { group.name }
			ol.members
				li.member(each={ member in group.members }, title={ member.name }): a
					img.avatar(src={ member.avatar_url + '?thumbnail&size=32' }, alt='')
		div.nav.dropdown
			button
				i.fa.fa-bars
			nav.dropdown-content
				ul.menu(if={ group.owner.id == me.id })
					li: p
						i.fa.fa-cog
						| グループの設定
					li: p
						i.fa.fa-users
						| メンバーの管理
				ul.menu
					li: p.invite
						i.fa.fa-user-plus
						| 招待
					li: p
						i.fa.fa-minus-circle
						| グループを離脱
	div.stream
		p.initializing(if={ init })
			i.fa.fa-spinner.fa-spin
			| 読み込み中
		p.empty(if={ !init && messages.length == 0 })
			i.fa.fa-info-circle
			span(if={ user }) このユーザーとまだ会話したことがありません
			span(if={ group }) このグループにまだ会話はありません
		virtual(each={ message in messages })
			mk-messaging-message(message={ message })
	div.typings
	form
		div.grippie(title='ドラッグしてフォームの広さを調整')
		textarea@text(placeholder='ここにメッセージを入力')
		div.uploads
		div.files
		button.submit(onclick={ say }, disabled={ saying }, title='メッセージを送信')
			i.fa.fa-paper-plane(if={ !saying })
			i.fa.fa-spinner.fa-spin(if={ saying })
		button.attach-from-local(type='button', title='PCから画像を添付する')
			i.fa.fa-upload
		button.attach-from-drive(type='button', title='アルバムから画像を添付する')
			i.fa.fa-folder-open
		input(name='file', type='file', accept='image/*')

style.
	display block
	position relative

	> header
		display block
		position absolute
		top 0
		left 0
		z-index 2
		width 100%
		background #fff

		> .container
			position relative
			max-width 600px
			width 100%
			margin 0 auto
			padding 0

			> .kyoppie
				display block
				width calc(100% - 48px)
				white-space nowrap
				overflow hidden

				> h1
					display inline-block
					margin 0
					padding 0 16px
					line-height 48px
					font-size 1em
					color #67747D
					vertical-align top


				> .members
					display inline-block
					margin 0
					padding 0
					list-style none

					> .member
						display inline-block
						margin 0
						padding 0

						> a
							display inline-block
							padding 8px 4px

							> .avatar
								display inline-block
								width 32px
								height 32px
								border-radius 100%
								vertical-align top






			> .dropdown
				display block
				position absolute
				top 0
				right 0
				overflow visible

				&[data-active='true']
					background #eee

					> button
						color #111 !important


					> .dropdown-content
						visibility visible



				> button
					-webkit-appearance none
					-moz-appearance none
					appearance none
					display block
					margin 0
					padding 0
					width 48px
					line-height 48px
					font-size 1.5em
					font-weight normal
					text-decoration none
					color #888
					background transparent
					outline none
					border none
					border-radius 0
					box-shadow none
					cursor pointer
					transition color 0.1s ease

					*
						pointer-events none


					&:hover
						color #444



				> .dropdown-content
					visibility hidden
					display block
					position absolute
					top auto
					right 0
					z-index 3
					width 270px
					margin 0
					padding 0
					background #eee

					> ul
						margin 0
						padding 0
						list-style none
						font-size 1em
						border-bottom solid 1px #ddd

						&:last-child
							border-bottom none


						> li
							display inline-block
							width 100%

							> *
								display inline-block
								z-index 1
								box-sizing border-box
								vertical-align top
								width 100%
								margin 0
								padding 12px 20px
								text-decoration none
								color #444
								transition none

								&:hover
									color #fff
									background-color $theme-color


								&:active
									color #fff
									background-color darken($theme-color, 10%)


								> i
									width 2em
									text-align center

	> .stream
		position absolute
		top 0
		left 0
		width 100%
		height calc(100% - 100px)
		overflow auto

		> .empty
			box-sizing border-box
			width 100%
			margin 0
			padding 16px 8px 8px 8px
			text-align center
			font-size 0.8em
			color rgba(0, 0, 0, 0.4)

			i
				margin-right 4px

		> .no-history
			display block
			margin 0
			padding 16px
			text-align center
			font-size 0.8em
			color rgba(0, 0, 0, 0.4)

			i
				margin-right 4px

		> .message
			// something

		> .date
			display block
			position relative
			margin 8px 0
			text-align center

			&:before
				content ''
				display block
				position absolute
				height 1px
				width 90%
				top 16px
				left 0
				right 0
				margin 0 auto
				background rgba(0, 0, 0, 0.1)

			> p
				display inline-block
				position relative
				margin 0
				padding 0 16px
				//font-weight bold
				line-height 32px
				color rgba(0, 0, 0, 0.3)
				background #fff

	> form
		position absolute
		z-index 2
		bottom 0
		width 600px
		max-width 100%
		margin 0 auto
		padding 0
		background rgba(255, 255, 255, 0.95)
		background-clip content-box

		.grippie
			height 10px
			margin-top -10px
			background transparent
			cursor ns-resize

			&:hover
				//background rgba(0, 0, 0, 0.1)

			&:active
				//background rgba(0, 0, 0, 0.2)

		textarea
			cursor auto
			display block
			box-sizing border-box
			width 100%
			min-width 100%
			max-width 100%
			height 64px
			margin 0
			padding 8px
			font-size 1em
			color #000
			outline none
			border none
			border-top solid 1px #eee
			border-radius 0
			box-shadow none
			background transparent

		.submit
			position absolute
			bottom 0
			right 0
			margin 0
			padding 10px 14px
			line-height 1em
			font-size 1em
			color #aaa
			transition color 0.1s ease

			&:hover
				color $theme-color

			&:active
				color darken($theme-color, 10%)
				transition color 0s ease


		.files
			display block
			margin 0
			padding 0 8px
			list-style none

			&:after
				content ''
				display block
				clear both

			> li
				display block
				position relative
				float left
				margin 4px
				padding 0
				width 64px
				height 64px
				background-color #eee
				background-repeat no-repeat
				background-position center center
				background-size cover
				cursor move

				&:hover
					> .remove
						display block

				> .remove
					-webkit-appearance none
					-moz-appearance none
					appearance none
					display none
					position absolute
					right -6px
					top -6px
					margin 0
					padding 0
					background transparent
					outline none
					border none
					border-radius 0
					box-shadow none
					cursor pointer

		.attach-from-local
		.attach-from-drive
			margin 0
			padding 10px 14px
			line-height 1em
			font-size 1em
			font-weight normal
			text-decoration none
			color #aaa
			transition color 0.1s ease

			&:hover
				color $theme-color

			&:active
				color darken($theme-color, 10%)
				transition color 0s ease

		input[type=file]
			display none

script.
	@mixin \api
	@mixin \messaging-stream

	@user = @opts.user
	@group = @opts.group
	@init = true
	@saying = false
	@messages = []

	@on \mount ~>
		@messaging-stream.connect @user.id
		@messaging-stream.event.on \message @on-message
		@messaging-stream.event.on \read @on-read

		@api \messaging/messages do
			user: if @user? then @user.id else undefined
			group: if @group? then @group.id else undefined
		.then (messages) ~>
			@init = false
			@messages = messages.reverse!
			@update!
		.catch (err) ~>
			console.error err

	@on \unmount ~>
		@messaging-stream.close!

	@say = ~>
		@saying = true
		@api \messaging/messages/create do
			user: if @user? then @user.id else undefined
			group: if @group? then @group.id else undefined
			text: @text.value
		.then (message) ~>
			# something
		.catch (err) ~>
			console.error err
		.then ~>
			@saying = false
			@update!

	@on-message = (message) ~>
		console.log message
		@messages.push message
		@update!

	@on-read = (ids) ~>
		console.log ids
		if not Array.isArray ids then ids = [ids]
		ids.for-each (id) ~>
			if (@messages.some (x) ~> x.id == id)
				exist = (@messages.map (x) -> x.id).index-of id
				@messages[exist].is_read = true
				@update!
