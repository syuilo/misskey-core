mk-images-viewer
	div.image@view(onclick={ click })
		img@img(src={ image.url + '?thumbnail&size=512' }, alt={ image.name }, title={ image.name })

style.
	display block
	padding 8px
	overflow hidden
	box-shadow 0 0 4px rgba(0, 0, 0, 0.2)
	border-radius 4px

	> .image

		> img
			display block
			max-height 256px
			max-width 100%
			margin 0 auto

script.
	@images = @opts.images

	@on \mount ~>
		# ↓の @images? はRiotのバグのため付与しています
		# このバグ(https://github.com/riot/riot/issues/1020)が修正され次第消してください
		# Riot3.0.0では修正されるみたい
		if @images?
			@image = @images.0

	@click = ~>
		window.open @image.url
