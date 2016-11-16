mk-ripple-button(onmousedown={ onmousedown }, onmouseup={ leave }, onmouseleave={ leave })
	div.ripple@ripple
	span
		<yield />

style.
	display block
	position relative
	box-sizing border-box
	margin 0
	padding 18px
	line-height 1em
	font-size 1em
	color #fff
	text-transform uppercase
	text-align center
	text-decoration none
	border-radius 4px
	background $theme-color
	overflow hidden
	cursor pointer

	*
		pointer-events none

	&:hover
		text-decoration none
		background lighten($theme-color, 5%)

	&:active
		text-decoration none

	> .ripple
		position absolute
		z-index 0
		width 2px
		height 2px
		background rgba(0, 0, 0, 0.15)
		border-radius 100%
	
	> span
		position relative
		z-index 1

script.
	@onmousedown = (event) ~>
		target = event.target
		rect = target.get-bounding-client-rect!
		position-x = rect.left
		position-y = rect.top

		box-w = target.client-width
		box-h = target.client-height
		circle-center-x = event.client-x - position-x
		circle-center-y = event.client-y - position-y

		scale = calc-scale box-w, box-h, circle-center-x, circle-center-y

		Velocity @ripple, \finish true
		Velocity @ripple, {
			top: (event.client-y - position-y - 1) + \px
			left: (event.client-x - position-x - 1) + \px
			scale: 1
			opacity: 1
		} 0ms
		Velocity @ripple, {
			scale: scale
		} {
			queue: false
			duration: 500ms
			easing: \ease-out
		}

	@leave = ~>
		Velocity @ripple, \finish true
		Velocity @ripple, {
			opacity: 0
		} {
			queue: false
			duration: 500ms
			easing: \ease
		}

	function distance(p, q)
		Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2))

	function calc-scale(box-w, box-h, circle-center-x, circle-center-y)
		origin =
			x: circle-center-x
			y: circle-center-y
		Math.max do
			distance {x: 0,     y: 0    } origin
			distance {x: box-w, y: 0    } origin
			distance {x: 0,     y: box-h} origin
			distance {x: box-w, y: box-h} origin
