'use strict'

var C = require('./constants.js')

class Flame {
	constructor(shooterID, pos, angle) {
		this.shooterID = shooterID
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
		this.ttl -= 1000/C.GAME_FPS
		if(this.ttl <= 0){
			game.entities.remove(this)
		}

		var mapData = game.map.data
		var mapLeft, mapRight, mapTop, mapBottom

		this.pos.y += this.dy
		mapLeft = Math.floor((this.pos.x - C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x - 1 + C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapRight][mapTop]){
			this.pos.y -= this.dy
			this.pos.y = Math.floor(this.pos.y/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.FLAME_SIZE/2
			this.dy *= -1
		}else if(mapData[mapLeft][mapBottom] || mapData[mapRight][mapBottom]){
			this.pos.y -= this.dy
			this.pos.y = (Math.floor(this.pos.y/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.FLAME_SIZE/2
			this.dy  *= -1
		}

		this.pos.x += this.dx
		mapLeft = Math.floor((this.pos.x - C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x - 1 + C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.FLAME_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapLeft][mapBottom]){
			this.pos.x -= this.dx
			this.pos.x = Math.floor(this.pos.x/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.FLAME_SIZE/2 + 1
			this.dx *= -1
		}else if(mapData[mapRight][mapTop] || mapData[mapRight][mapBottom]){
			this.pos.x -= this.dx
			this.pos.x = (Math.floor(this.pos.x/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.FLAME_SIZE/2
			this.dx *= -1
		}

		for(var player of game.players){
			if(player.id === this.shooterID){
				continue
			}
			if(Math.abs(player.pos.x - this.pos.x) < (C.PLAYER_SIZE + C.FLAME_SIZE)/2
					&& Math.abs(player.pos.y - this.pos.y) < (C.PLAYER_SIZE + C.FLAME_SIZE)/2){
				player.hit()
				game.entities.remove(this)
			}
		}
	}

	render(game, canvas, ctx) {
		ctx.fillStyle = '#FE642E'
		ctx.fillRect(
			this.pos.x - C.FLAME_SIZE/2,
			this.pos.y - C.FLAME_SIZE/2,
			C.FLAME_SIZE,
			C.FLAME_SIZE
		)
	}
}

module.exports = Flame
