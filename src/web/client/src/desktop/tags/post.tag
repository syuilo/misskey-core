mk-post(tabindex='-1', title={ title }, class={ repost: is-repost }, onkeydown={ on-key-down })

	div.reply-to(if={ p.reply_to })
		mk-post-sub(post={ p.reply_to })

	div.repost(if={ is-repost })
		p
			a.avatar-anchor(href={ CONFIG.url + '/' + post.user.username }, data-user-preview={ post.user.id }): img.avatar(src={ post.user.avatar_url + '?thumbnail&size=32' }, alt='avatar')
			i.fa.fa-retweet
			a.name(href={ CONFIG.url + '/' + post.user.username }, data-user-preview={ post.user.id }) { post.user.name }
			| がRepost
		mk-time(time={ post.created_at })

	article
		a.avatar-anchor(href={ CONFIG.url + '/' + p.user.username })
			img.avatar(src={ p.user.avatar_url + '?thumbnail&size=64' }, alt='avatar', data-user-preview={ p.user.id })
		div.main
			header
				div.left
					a.name(href={ CONFIG.url + '/' + p.user.username }, data-user-preview={ p.user.id })
						| { p.user.name }
					span.username
						| @{ p.user.username }
				div.right
					a.time(href={ url })
						mk-time(time={ p.created_at })
			div.body
				div.text
					a.reply(if={ p.reply_to }): i.fa.fa-reply
					soan@text
					a.quote(if={ p.repost != null }) RP:
				div.images(if={ p.images })
					mk-images-viewer(images={ p.images })
				div.repost(if={ p.repost })
					i.fa.fa-quote-right.fa-flip-horizontal
					mk-post-preview.repost(post={ p.repost })
			footer
				button(onclick={ reply }, title='返信')
					i.fa.fa-reply
					p.count(if={ p.replies_count > 0 }) { p.replies_count }
				button(onclick={ repost }, title='Repost')
					i.fa.fa-retweet
					p.count(if={ p.repost_count > 0 }) { p.repost_count }
				button(class={ liked: p.is_liked }, onclick={ like }, title='善哉')
					i.fa.fa-thumbs-o-up
					p.count(if={ p.likes_count > 0 }) { p.likes_count }
				button(onclick={ NotImplementedException }): i.fa.fa-ellipsis-h
				button(onclick={ toggle-detail }, title='詳細')
					i.fa.fa-caret-down(if={ !is-detail-opened })
					i.fa.fa-caret-up(if={ is-detail-opened })
	div.detail(if={ is-detail-opened })
		// Riot3.0.0未満では、 if が評価されずに必ずカスタムタグが(内部的に)レンダリングされてしまうバグがあるので、
		// その対策としてのハック SEE: https://github.com/riot/riot/issues/1020#issuecomment-156388012
		//mk-post-likes-graph(width='462', height='130', post={ p })
		mk-post-status-graph(width='462', height='130', post={ parent.p }, each={ is-detail-opened ? [1] : [] })

style.
	display block
	position relative
	margin 0
	padding 0
	font-family 'Meiryo', 'メイリオ', sans-serif
	background #fff
	background-clip padding-box

	&:focus
		z-index 1

		&:after
			content ""
			pointer-events none
			position absolute
			top 2px
			right 2px
			bottom 2px
			left 2px
			border 2px solid rgba($theme-color, 0.3)
			border-radius 4px

	> .repost
		position relative
		color #9dbb00
		background linear-gradient(to bottom, #edfde2 0%, #fff 100%)

		> p
			margin 0
			padding 16px 32px
			line-height 28px

			.avatar-anchor
				display inline-block

				.avatar
					vertical-align bottom
					width 28px
					height 28px
					margin 0 8px 0 0
					border-radius 6px

			i
				margin-right 4px

			.name
				font-weight bold

		> mk-time
			position absolute
			top 16px
			right 32px
			font-size 0.9em
			line-height 28px

		& + article
			padding-top 8px

	> .reply-to
		padding 0 16px
		background rgba(0, 0, 0, 0.0125)

		> mk-post-preview
			background transparent

	> article
		position relative
		padding 28px 32px 18px 32px

		&:after
			content ""
			display block
			clear both

		&:hover
			> .main > footer > button
				color #888

		> .avatar-anchor
			display block
			float left
			margin 0 16px 0 0

			> .avatar
				display block
				width 58px
				height 58px
				margin 0
				border-radius 8px
				vertical-align bottom

		> .main
			float left
			width calc(100% - 74px)

			> header
				margin-bottom 4px
				white-space nowrap

				&:after
					content ""
					display block
					clear both

				> .left
					float left

					> .name
						display inline
						margin 0
						padding 0
						color #777
						font-size 1em
						font-weight 700
						text-align left
						text-decoration none

						&:hover
							text-decoration underline

					> .username
						text-align left
						margin 0 0 0 8px
						color #ccc

				> .right
					float right

					> .time
						font-size 0.9em
						color #c0c0c0

			> .body

				> .text
					cursor default
					display block
					margin 0
					padding 0
					word-wrap break-word
					font-size 1.1em
					color #717171

					mk-url-preview
						margin-top 8px

					> .reply
						margin-right 8px
						color #717171

					> .quote
						margin-left 4px
						font-style oblique
						color #a0bf46

				> .images
					> img
						display block
						max-width 100%

				> .repost
					position relative
					margin 8px 0

					> i:first-child
						position absolute
						top -8px
						left -8px
						z-index 1
						color #c0dac6
						font-size 28px
						background #fff

					> mk-post-preview
						padding 16px
						border dashed 1px #c0dac6
						border-radius 8px

			> footer
				> button
					margin 0 28px 0 0
					padding 0 8px
					line-height 32px
					font-size 1em
					color #ddd
					background transparent
					border none
					box-shadow none
					cursor pointer

					&:hover
						color #666

					> .count
						display inline
						margin 0 0 0 8px
						color #999

					&.liked
						color $theme-color

					&:last-child
						position absolute
						right 32px
						margin 0

	> .detail
		padding-top 4px
		background rgba(0, 0, 0, 0.0125)

style(theme='dark').
	background #0D0D0D

	> article

		&:hover
			> .main > footer > button
				color #eee

		> .main
			> header
				> .left
					> .name
						color #9e9c98

					> .username
						color #41403f

				> .right
					> .time
						color #4e4d4b

			> .body
				> .text
					color #9e9c98

			> footer
				> button
					color #9e9c98

					&:hover
						color #fff

					> .count
						color #eee

script.
	@mixin \api
	@mixin \text
	@mixin \user-preview
	@mixin \NotImplementedException

	@post = @opts.post
	@is-repost = @post.repost? and !@post.text?
	@p = if @is-repost then @post.repost else @post
	@title = 'a' # TODO
	@url = CONFIG.url + '/' + @p.user.username + '/' + @p.id
	@is-detail-opened = false

	@reply-form = null
	@reply-form-controller = riot.observable!

	@repost-form = null
	@repost-form-controller = riot.observable!

	@on \mount ~>
		if @p.text?
			tokens = if @p._highlight?
				then @analyze @p._highlight
				else @analyze @p.text

			@text.innerHTML = if @p._highlight?
				then @compile tokens, true, false
				else @compile tokens

			@text.child-nodes.for-each (e) ~>
				if e.tag-name == \MK-URL
					riot.mount e

			# URLをプレビュー
			tokens
				.filter (t) -> t.type == \link
				.map (t) ~>
					@preview = @text.append-child document.create-element \mk-url-preview
					riot.mount @preview, do
						url: t.content

	@reply = ~>
		if !@reply-form?
			@reply-form = document.body.append-child document.create-element \mk-post-form-window
			riot.mount @reply-form, do
				controller: @reply-form-controller
				reply: @p
		@reply-form-controller.trigger \open

	@repost = ~>
		if !@repost-form?
			@repost-form = document.body.append-child document.create-element \mk-repost-form-window
			riot.mount @repost-form, do
				controller: @repost-form-controller
				post: @p
		@repost-form-controller.trigger \open

	@like = ~>
		if @p.is_liked
			@api \posts/likes/delete do
				post: @p.id
			.then ~>
				@p.is_liked = false
				@update!
		else
			@api \posts/likes/create do
				post: @p.id
			.then ~>
				@p.is_liked = true
				@update!

	@toggle-detail = ~>
		@is-detail-opened = !@is-detail-opened
		@update!

	@on-key-down = (e) ~>
		| e.which == 38 or e.which == 74 or (e.which == 9 and e.shift-key) => # ↑, j or Shift+Tab
			focus @root, (e) -> e.previous-element-sibling
		| e.which == 40 or e.which == 75 or e.which == 9 => # ↓, k or Tab
			focus @root, (e) -> e.next-element-sibling
		| e.which == 69 => # e
			@repost!
		| e.which == 70 or e.which == 76 => # f or l
			@like!
		| e.which == 82 => # r
			@reply!

	function focus(el, fn)
		target = fn el
		if target?
			if target.has-attribute \tabindex
				target.focus!
			else
				focus target, fn
