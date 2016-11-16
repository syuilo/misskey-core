mk-window(data-flexible={ is-flexible }, data-colored={ opts.colored }, ondragover={ ondragover })
	div.bg@bg(show={ is-modal }, onclick={ bg-click })
	div.main@main(tabindex='-1', data-is-modal={ is-modal }, onmousedown={ on-body-mousedown }, onkeydown={ on-keydown })
		div.body
			header@header(onmousedown={ on-header-mousedown })
				h1(data-yield='header')
					| <yield from="header"/>
				button.close(if={ can-close }, onmousedown={ repel-move }, onclick={ close }, title='閉じる'): i.fa.fa-times
			div.content(data-yield='content')
				| <yield from="content"/>
		div.handle.top(if={ can-resize }, onmousedown={ on-top-handle-mousedown })
		div.handle.right(if={ can-resize }, onmousedown={ on-right-handle-mousedown })
		div.handle.bottom(if={ can-resize }, onmousedown={ on-bottom-handle-mousedown })
		div.handle.left(if={ can-resize }, onmousedown={ on-left-handle-mousedown })
		div.handle.top-left(if={ can-resize }, onmousedown={ on-top-left-handle-mousedown })
		div.handle.top-right(if={ can-resize }, onmousedown={ on-top-right-handle-mousedown })
		div.handle.bottom-right(if={ can-resize }, onmousedown={ on-bottom-right-handle-mousedown })
		div.handle.bottom-left(if={ can-resize }, onmousedown={ on-bottom-left-handle-mousedown })

style.
	display block

	> .bg
		display block
		position fixed
		z-index 2048
		top 0
		left 0
		width 100%
		height 100%
		background rgba(0, 0, 0, 0.7)
		opacity 0
		pointer-events none

	> .main
		display block
		position fixed
		z-index 2048
		top 15%
		left 0
		margin 0
		opacity 0
		pointer-events none

		&:focus
			&:not([data-is-modal])
				> .body
					box-shadow 0 0 0px 1px rgba($theme-color, 0.5), 0 2px 6px 0 rgba(0, 0, 0, 0.2)

		> .handle
			$size = 8px

			position absolute

			&.top
				top -($size)
				left 0
				width 100%
				height $size
				cursor ns-resize

			&.right
				top 0
				right -($size)
				width $size
				height 100%
				cursor ew-resize

			&.bottom
				bottom -($size)
				left 0
				width 100%
				height $size
				cursor ns-resize

			&.left
				top 0
				left -($size)
				width $size
				height 100%
				cursor ew-resize

			&.top-left
				top -($size)
				left -($size)
				width $size * 2
				height $size * 2
				cursor nwse-resize

			&.top-right
				top -($size)
				right -($size)
				width $size * 2
				height $size * 2
				cursor nesw-resize

			&.bottom-right
				bottom -($size)
				right -($size)
				width $size * 2
				height $size * 2
				cursor nwse-resize

			&.bottom-left
				bottom -($size)
				left -($size)
				width $size * 2
				height $size * 2
				cursor nesw-resize

		> .body
			height 100%
			overflow hidden
			background #fff
			border-radius 6px
			box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.2)

			> header
				position relative
				z-index 128
				overflow hidden
				cursor move
				background #fff
				background-clip padding-box
				border-radius 6px 6px 0 0
				box-shadow 0 1px 0 rgba(#000, 0.1)

				&, *
					-ms-user-select none
					-moz-user-select none
					-webkit-user-select none
					user-select none

				> h1
					pointer-events none
					display block
					margin 0
					text-align center
					font-size 1em
					line-height 40px
					font-weight normal
					color #666

				> .close
					-webkit-appearance none
					-moz-appearance none
					appearance none
					cursor pointer
					display block
					position absolute
					top 0
					right 0
					z-index 1
					margin 0
					padding 0
					font-size 1.2em
					color rgba(#000, 0.4)
					border none
					outline none
					box-shadow none
					background transparent

					&:hover
						color rgba(#000, 0.6)

					&:active
						color darken(#000, 30%)

					> i
						padding 0
						width 40px
						line-height 40px

			> .content
				position relative
				height 100%

	&:not([flexible])
		> .main > .body > .content
			height calc(100% - 40px)

	&[data-colored]

		> .main > .body

			> header
				box-shadow 0 1px 0 rgba($theme-color, 0.1)

				> h1
					color #d0b4ac

				> .close
					color rgba($theme-color, 0.4)

					&:hover
						color rgba($theme-color, 0.6)

					&:active
						color darken($theme-color, 30%)

script.
	@min-height = 40px
	@min-width = 200px

	@is-open = false
	@is-modal = if @opts.is-modal? then @opts.is-modal else false
	@can-close = if @opts.can-close? then @opts.can-close else true
	@is-flexible = !@opts.height?
	@can-resize = not @is-flexible

	@controller = @opts.controller

	@on \mount ~>
		@main.style.width = @opts.width || \530px
		@main.style.height = @opts.height || \auto

		@main.style.top = \15%
		@main.style.left = (window.inner-width / 2) - (@main.offset-width / 2) + \px

		@header.add-event-listener \contextmenu (e) ~>
			e.prevent-default!

		window.add-event-listener \resize ~>
			position = @main.get-bounding-client-rect!
			browser-width = window.inner-width
			browser-height = window.inner-height
			window-width = @main.offset-width
			window-height = @main.offset-height

			if position.left < 0
				@main.style.left = 0

			if position.top < 0
				@main.style.top = 0

			if position.left + window-width > browser-width
				@main.style.left = browser-width - window-width + \px

			if position.top + window-height > browser-height
				@main.style.top = browser-height - window-height + \px

	@controller.on \toggle ~>
		@toggle!

	@controller.on \open ~>
		@open!

	@controller.on \close ~>
		@close!

	@toggle = ~>
		if @is-open
			@close!
		else
			@open!

	@open = ~>
		@is-open = true
		@controller.trigger \opening

		@top!

		if @is-modal
			@bg.style.pointer-events = \auto
			Velocity @bg, \finish true
			Velocity @bg, {
				opacity: 1
			} {
				queue: false
				duration: 100ms
				easing: \linear
			}

		@main.style.pointer-events = \auto
		Velocity @main, \finish true
		Velocity @main, {scale: 1.1} 0ms
		Velocity @main, {
			opacity: 1
			scale: 1
		} {
			queue: false
			duration: 200ms
			easing: \ease-out
		}

		@main.focus!

		set-timeout ~>
			@controller.trigger \opened
		, 300ms

	@close = ~>
		@is-open = false
		@controller.trigger \closing

		if @is-modal
			@bg.style.pointer-events = \none
			Velocity @bg, \finish true
			Velocity @bg, {
				opacity: 0
			} {
				queue: false
				duration: 300ms
				easing: \linear
			}

		@main.style.pointer-events = \none
		Velocity @main, \finish true
		Velocity @main, {
			opacity: 0
			scale: 0.8
		} {
			queue: false
			duration: 300ms
			easing: [ 0.5, -0.5, 1, 0.5 ]
		}

		set-timeout ~>
			@controller.trigger \closed
		, 300ms

	# 最前面へ移動します
	@top = ~>
		z = 0

		ws = document.query-selector-all \mk-window
		ws.for-each (w) !~>
			if w == @root then return
			m = w.query-selector ':scope > .main'
			mz = Number(document.default-view.get-computed-style m, null .z-index)
			if mz > z then z := mz

		if z > 0
			@main.style.z-index = z + 1
			if @is-modal then @bg.style.z-index = z + 1

	@repel-move = (e) ~>
		e.stop-propagation!
		return true

	@bg-click = ~>
		if @can-close
			@close!

	@on-body-mousedown = (e) ~>
		@top!
		true

	# ヘッダー掴み時
	@on-header-mousedown = (e) ~>
		if not contains @main, document.active-element
			@main.focus!

		position = @main.get-bounding-client-rect!

		click-x = e.client-x
		click-y = e.client-y
		move-base-x = click-x - position.left
		move-base-y = click-y - position.top
		browser-width = window.inner-width
		browser-height = window.inner-height
		window-width = @main.offset-width
		window-height = @main.offset-height

		# 動かした時
		drag-listen (me) ~>
			move-left = me.client-x - move-base-x
			move-top = me.client-y - move-base-y

			# 上はみ出し
			if move-top < 0
				move-top = 0

			# 左はみ出し
			if move-left < 0
				move-left = 0

			# 下はみ出し
			if move-top + window-height > browser-height
				move-top = browser-height - window-height

			# 右はみ出し
			if move-left + window-width > browser-width
				move-left = browser-width - window-width

			@main.style.left = move-left + \px
			@main.style.top = move-top + \px

	# 上ハンドル掴み時
	@on-top-handle-mousedown = (e) ~>
		base = e.client-y
		height = parse-int((get-computed-style @main, '').height, 10)
		top = parse-int((get-computed-style @main, '').top, 10)

		# 動かした時
		drag-listen (me) ~>
			move = me.client-y - base
			if top + move > 0
				if height + -move > @min-height
					@apply-transform-height height + -move
					@apply-transform-top top + move
				else # 最小の高さより小さくなろうとした時
					@apply-transform-height @min-height
					@apply-transform-top top + (height - @min-height)
			else # 上のはみ出し時
				@apply-transform-height top + height
				@apply-transform-top 0

	# 右ハンドル掴み時
	@on-right-handle-mousedown = (e) ~>
		base = e.client-x
		width = parse-int((get-computed-style @main, '').width, 10)
		left = parse-int((get-computed-style @main, '').left, 10)
		browser-width = window.inner-width

		# 動かした時
		drag-listen (me) ~>
			move = me.client-x - base
			if left + width + move < browser-width
				if width + move > @min-width
					@apply-transform-width width + move
				else # 最小の幅より小さくなろうとした時
					@apply-transform-width @min-width
			else # 右のはみ出し時
				@apply-transform-width browser-width - left

	# 下ハンドル掴み時
	@on-bottom-handle-mousedown = (e) ~>
		base = e.client-y
		height = parse-int((get-computed-style @main, '').height, 10)
		top = parse-int((get-computed-style @main, '').top, 10)
		browser-height = window.inner-height

		# 動かした時
		drag-listen (me) ~>
			move = me.client-y - base
			if top + height + move < browser-height
				if height + move > @min-height
					@apply-transform-height height + move
				else # 最小の高さより小さくなろうとした時
					@apply-transform-height @min-height
			else # 下のはみ出し時
				@apply-transform-height browser-height - top

	# 左ハンドル掴み時
	@on-left-handle-mousedown = (e) ~>
		base = e.client-x
		width = parse-int((get-computed-style @main, '').width, 10)
		left = parse-int((get-computed-style @main, '').left, 10)

		# 動かした時
		drag-listen (me) ~>
			move = me.client-x - base
			if left + move > 0
				if width + -move > @min-width
					@apply-transform-width width + -move
					@apply-transform-left left + move
				else # 最小の幅より小さくなろうとした時
					@apply-transform-width @min-width
					@apply-transform-left left + (width - @min-width)
			else # 左のはみ出し時
				@apply-transform-width left + width
				@apply-transform-left 0

	# 左上ハンドル掴み時
	@on-top-left-handle-mousedown = (e) ~>
		@on-top-handle-mousedown e
		@on-left-handle-mousedown e

	# 右上ハンドル掴み時
	@on-top-right-handle-mousedown = (e) ~>
		@on-top-handle-mousedown e
		@on-right-handle-mousedown e

	# 右下ハンドル掴み時
	@on-bottom-right-handle-mousedown = (e) ~>
		@on-bottom-handle-mousedown e
		@on-right-handle-mousedown e

	# 左下ハンドル掴み時
	@on-bottom-left-handle-mousedown = (e) ~>
		@on-bottom-handle-mousedown e
		@on-left-handle-mousedown e

	# 高さを適用
	@apply-transform-height = (height) ~>
		@main.style.height = height + \px

	# 幅を適用
	@apply-transform-width = (width) ~>
		@main.style.width = width + \px

	# Y座標を適用
	@apply-transform-top = (top) ~>
		@main.style.top = top + \px

	# X座標を適用
	@apply-transform-left = (left) ~>
		@main.style.left = left + \px

	function drag-listen fn
		window.add-event-listener \mousemove  fn
		window.add-event-listener \mouseleave drag-clear.bind null fn
		window.add-event-listener \mouseup    drag-clear.bind null fn

	function drag-clear fn
		window.remove-event-listener \mousemove  fn
		window.remove-event-listener \mouseleave drag-clear
		window.remove-event-listener \mouseup    drag-clear

	@ondragover = (e) ~>
		e.data-transfer.drop-effect = \none

	@on-keydown = (e) ~>
		if e.which == 27 # Esc
			if @can-close
				e.prevent-default!
				e.stop-propagation!
				@close!
		true # Riot 3.0.0 にしたら削除して大丈夫かも

	function contains(parent, child)
		node = child.parent-node
		while node?
			if node == parent
				return true
			node = node.parent-node
		return false
