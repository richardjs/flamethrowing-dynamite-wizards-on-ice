'use strict'

var C = require('./constants.js')

class Player {
	constructor(id, pos) {
		this.id = id
		this.type = 'player'
		this.pos = pos

		this.keys = {}
	}

	update(game) {
		if(this.keys.up){
			this.pos.y -= C.PLAYER_SPEED
		}
		if(this.keys.down){
			this.pos.y += C.PLAYER_SPEED
		}
		if(this.keys.left){
			this.pos.x -= C.PLAYER_SPEED
		}
		if(this.keys.right){
			this.pos.x += C.PLAYER_SPEED
		}
	}

	render(canvas, ctx){
		ctx.fillStyle = 'red'
		ctx.fillRect(this.pos.x - 10, this.pos.y - 10, 20, 20)
	}
}

module.exports = Player
