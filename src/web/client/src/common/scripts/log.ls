module.exports = (me, msg) ~>
	if me? && me.data.debug
		console.log msg
