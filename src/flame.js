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
		var speed = C.FLAME_MIN_SPEED + Math.random()*(C.FLAME_MAX_SPEED - C.FLAME_MIN_SPEED)
		this.dx = Math.cos(angle) * speed
		this.dy = Math.sin(angle) * speed
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
