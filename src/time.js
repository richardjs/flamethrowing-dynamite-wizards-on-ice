'use strict'

var C = require('./constants.js')

exports.timer = function(callback, interval){
	var lastTime = Date.now()
	var drift = 0

	function tick(){
		var now = Date.now()
		var delta = now - lastTime
		lastTime = now
		drift += delta - interval

		if(drift > interval*C.TIMER_SKIP_FACTOR){
			drift = 0;
			console.log('skipping frames')
		}

		callback();

		setTimeout(tick, Math.max(interval - drift, 0))
	}

	setTimeout(tick, interval)
}
