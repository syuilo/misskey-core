mk-entrance-signin
	mk-signin
	mk-ripple-button.signup(onclick={ signup }) 新規登録

style.
	display block
	width 290px
	margin 0 auto

	> mk-signin
		background #fff
		background-clip padding-box
		border solid 1px rgba(0, 0, 0, 0.1)
		border-radius 4px
		box-shadow 0 0 8px rgba(0, 0, 0, 0.1)

	> .signup
		margin-top 16px

script.
	@signup = ~>
		@opts.onsignup!
