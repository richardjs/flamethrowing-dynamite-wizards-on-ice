'use strict'

var INPUT_MAP = {
	87: 'up',
	83: 'down',
	65: 'left',
	68: 'right',
	78: 'name'
}

class Input {
	constructor(game) {
		this.game = game
		this.keys = {}
		this.angle = 0
		this.queue = []
		this.seqnum = 0

		document.body.addEventListener('keydown', event => {
			if(!INPUT_MAP[event.which]) return
			this.keys[INPUT_MAP[event.which]] = true
		})
		document.body.addEventListener('keyup', event => {
			if(!INPUT_MAP[event.which]) return
			this.keys[INPUT_MAP[event.which]] = false
		})
		document.body.addEventListener('mousemove', event => {
			this.angle = Math.atan2(
				event.pageY - window.innerHeight/2,
				event.pageX - window.innerWidth/2
			)
		})
		document.body.addEventListener('mousedown', event => {
			this.keys.fire = true
		})
		document.body.addEventListener('mouseup', event => {
			this.keys.fire = false
		})
	}
}

module.exports = Input
