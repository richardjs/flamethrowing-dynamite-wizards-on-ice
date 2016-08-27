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
		var mapData = game.map.data
		var mapLeft
		var mapRight
		var mapTop
		var mapBottom

		if(this.keys.up){
			this.pos.y -= C.PLAYER_SPEED
		}
		if(this.keys.down){
			this.pos.y += C.PLAYER_SPEED
		}

		mapLeft = Math.floor((this.pos.x - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x -1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapRight][mapTop]){
			this.pos.y += C.PLAYER_SPEED
			this.pos.y = Math.floor(this.pos.y/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.PLAYER_SIZE/2
		}
		if(mapData[mapLeft][mapBottom] || mapData[mapRight][mapBottom]){
			this.pos.y -= C.PLAYER_SPEED
			this.pos.y = (Math.floor(this.pos.y/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.PLAYER_SIZE/2
		}

		if(this.keys.left){
			this.pos.x -= C.PLAYER_SPEED
		}
		if(this.keys.right){
			this.pos.x += C.PLAYER_SPEED
		}

		mapLeft = Math.floor((this.pos.x - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x -1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapLeft][mapBottom]){
			this.pos.x += C.PLAYER_SPEED
			this.pos.x = Math.floor(this.pos.x/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.PLAYER_SIZE/2
		}
		if(mapData[mapRight][mapTop] || mapData[mapRight][mapBottom]){
			this.pos.x -= C.PLAYER_SPEED
			this.pos.x = (Math.floor(this.pos.x/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.PLAYER_SIZE/2
		}
	}

	render(canvas, ctx){
		ctx.fillStyle = 'red'
		ctx.fillRect(
			this.pos.x - C.PLAYER_SIZE/2,
			this.pos.y - C.PLAYER_SIZE/2,
			C.PLAYER_SIZE,
			C.PLAYER_SIZE
		)
	}
}

module.exports = Player
