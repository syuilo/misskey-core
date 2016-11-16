mk-entrance-signup
	mk-signup
	button.cancel(type='button', onclick={ cancel }, title='キャンセル'): i.fa.fa-times

style.
	display block
	position relative
	width 368px
	margin 0 auto

	&:hover
		> .cancel
			opacity 1

	> mk-signup
		background #fff
		background-clip padding-box
		border solid 1px rgba(0, 0, 0, 0.1)
		border-radius 4px
		box-shadow 0 0 8px rgba(0, 0, 0, 0.1)

	> .cancel
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
		color #999
		border none
		outline none
		box-shadow none
		background transparent
		opacity 0
		transition opacity 0.1s ease

		&:hover
			color #555

		&:active
			color #222

		> i
			padding 14px

script.
	@cancel = ~>
		@opts.onsignin!
