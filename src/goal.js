'use strict'

var C = require('./constants.js')

class Goal {
	constructor(pos) {
		this.type = 'goal'
		this.pos = pos
	}

	update(game) {
		for(var player of game.players){
			if(Math.abs(player.pos.x - this.pos.x) < C.PICKUP_THRESHOLD
					&& Math.abs(player.pos.y - this.pos.y) < C.PICKUP_THRESHOLD){
				console.log('a winner is you!')
				if(!game.winner){
					game.winner = player.id
				}
			}
		}
	}

	render(game, canvas, ctx){
		ctx.fillStyle = 'green'
		ctx.fillRect(this.pos.x - 5, this.pos.y - 5, 10, 10)
	}
}

module.exports = Goal
