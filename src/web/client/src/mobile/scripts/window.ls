riot = require \riot

duration = 500ms
easing = [0 0.7 0 1]

riot.mixin \window do
	init: ->
		@open = ~>
			@bg.style.pointer-events = \auto
			Velocity @bg, {
				opacity: 1
			} {
				duration: duration
				easing: \linear
			}

			@body.style.pointer-events = \auto
			Velocity @body, { top: window.inner-height + \px } 0ms
			Velocity @body, {
				top: \16px
			} {
				duration: duration
				easing: easing
			}

		@close = ~>
			@bg.style.pointer-events = \none
			Velocity @bg, {
				opacity: 0
			} {
				duration: duration
				easing: \linear
			}

			@body.style.pointer-events = \none
			Velocity @body, {
				top: window.inner-height + \px
			} {
				duration: duration
				easing: easing
			}

			set-timeout ~>
				@unmount!
			, duration

		@on \mount ~>
			@open!
