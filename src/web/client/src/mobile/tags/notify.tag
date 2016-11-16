mk-notify
	mk-notification-preview(notification={ opts.notification })

style.
	display block
	position fixed
	z-index 1024
	top 100%
	left 0
	width 100%
	pointer-events none
	-webkit-backdrop-filter blur(2px)
	backdrop-filter blur(2px)
	background-color rgba(#000, 0.5)

script.
	@on \mount ~>
		Velocity @root, {
			top: (window.inner-height - @root.client-height) + \px
		} {
			duration: 500ms
			easing: \ease-out
		}

		set-timeout ~>
			Velocity @root, {
				top: '100%'
			} {
				duration: 500ms
				easing: \ease-out
				complete: ~>
					@unmount!
			}
		, 6000ms
