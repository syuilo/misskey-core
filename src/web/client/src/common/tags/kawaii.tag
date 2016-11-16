mk-kawaii
	p@kawaii

style.
	display block

	> p
		display block
		margin 0
		padding 0

script.
	@kawaiies = [
		\あかり
		\ちなつ
		\結衣
		\京子
		\向日葵
		\櫻子
		\ありす
		\日菜子
		\まゆ
	]

	@on \mount ~>
		@set!
		set-interval @change, 20000ms

	@set = ~>
		kawaii = @kawaiies[Math.floor Math.random! * @kawaiies.length]
		@kawaii.innerHTML = kawaii + 'かわいいよ' + kawaii
		@update!

	@change = ~>
		Velocity @kawaii, {
			opacity: 0
		} {
			duration: 500ms
			easing: \linear
			complete: @set
		}

		Velocity @kawaii, {
			opacity: 1
		} {
			duration: 500ms
			easing: \linear
		}
