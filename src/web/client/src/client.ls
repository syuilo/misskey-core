head = document.get-elements-by-tag-name \head .0

ua = navigator.user-agent.to-lower-case!
is-mobile =
	(ua.index-of \mobile)  > -1 or
	(ua.index-of \iphone)  > -1 or
	(ua.index-of \ipad)    > -1 or
	(ua.index-of \android) > -1

if is-mobile
	mount-mobile!
else
	mount-desktop!

function mount-desktop
	style = document.create-element \link
		..set-attribute \href '/_/resources/desktop/style.css'
		..set-attribute \rel \stylesheet
	head.append-child style

	script = document.create-element \script
		..set-attribute \src '/_/resources/desktop/script.js'
		..set-attribute \async \true
		..set-attribute \defer \true
	head.append-child script

function mount-mobile
	meta = document.create-element \meta
		..set-attribute \name \viewport
		..set-attribute \content 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'
	head.append-child meta

	style = document.create-element \link
		..set-attribute \href '/_/resources/mobile/style.css'
		..set-attribute \rel \stylesheet
	head.append-child style

	script = document.create-element \script
		..set-attribute \src '/_/resources/mobile/script.js'
		..set-attribute \async \true
		..set-attribute \defer \true
	head.append-child script
