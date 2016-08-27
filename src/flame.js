'use strict'

var C = require('./constants.js')

class Flame {
	constructor(pos, angle) {
		this.type = 'flame'
		if(pos){
			this.pos = {
				x: pos.x,
				y: pos.y
			}
		}
		this.angle = angle
		this.dx = Math.cos(angle) * C.FLAME_SPEED
		this.dy = Math.sin(angle) * C.FLAME_SPEED
		this.ttl = C.FLAME_TTL
	}

	update(game) {
		this.pos.x += this.dx
		this.pos.y += this.dy
		for(var player of game.players){
		}
		this.ttl -= 1000/C.GAME_FPS
		if(this.ttl <= 0){
			game.entities.remove(this)
		}
	}

	render(game, canvas, ctx) {
		ctx.fillStyle = '#FE642E'
		ctx.fillRect(this.pos.x - 5, this.pos.y - 5, 10, 10)
	}
}

module.exports = Flame
