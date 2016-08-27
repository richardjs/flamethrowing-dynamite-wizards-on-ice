'use strict'

class Player {
	constructor(id, pos) {
		this.id = id
		this.type = 'player'
		this.pos = pos

		this.keys = {}
	}

	update(game) {
	}

	render(canvas, ctx){
		ctx.fillStyle = 'red'
		ctx.fillRect(this.pos.x - 10, this.pos.y - 10, 20, 20)
	}
}

module.exports = Player
