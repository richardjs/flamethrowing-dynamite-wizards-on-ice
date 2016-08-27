'use strict'

var INPUT_MAP = {
	87: 'up',
	83: 'down',
	65: 'left',
	68: 'right'
}

class Input {
	constructor(game) {
		this.game = game
		this.keys = {}
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
	}
}

module.exports = Input
