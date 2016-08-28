'use strict'

var C = require('./constants.js')
var Flame = require('./flame.js')

class Dynamite {
	constructor(shooterID, pos, target, fuseLength) {
		this.shooterID = shooterID
		this.type = 'dynamite'
		if(pos){
			this.pos = {
				x: pos.x,
				y: pos.y
			}
		}
		if(target){
			this.target = {
				x: target.x,
				y: target.y
			}
			this.angle = Math.atan2(
				target.y - pos.y,
				target.x - pos.x
			)
			this.dx = Math.cos(this.angle) * C.DYNAMITE_SPEED
			this.dy = Math.sin(this.angle) * C.DYNAMITE_SPEED
			this.moveTimer = (1000/C.GAME_FPS)*Math.sqrt(Math.pow(pos.x - target.x, 2) + Math.pow(pos.y - target.y, 2)) / C.DYNAMITE_SPEED
		}
		this.fuseLength = fuseLength
		this.originalFuse = fuseLength
	}

	update(game) {
		if(this.moveTimer > 0){
			this.moveTimer -= 1000/C.GAME_FPS
		}
		if(this.moveTimer <= 0){
			this.dx = 0
			this.dy = 0
		}

		if(this.fuseLength > 0){
			this.fuseLength -= 1000/C.GAME_FPS
		}
		if(this.fuseLength <= 0){
			this.fuseLength = 0
			this.explode(game)
		}

		var mapData = game.map.data
		var mapLeft, mapRight, mapTop, mapBottom

		this.pos.y += this.dy
		mapLeft = Math.floor((this.pos.x - C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x - 1 + C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapRight][mapTop]){
			this.pos.y -= this.dy
			this.pos.y = Math.floor(this.pos.y/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.DYNAMITE_SIZE/2
			this.dx = 0
			this.dy = 0
		}else if(mapData[mapLeft][mapBottom] || mapData[mapRight][mapBottom]){
			this.pos.y -= this.dy
			this.pos.y = (Math.floor(this.pos.y/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.DYNAMITE_SIZE/2
			this.dx = 0
			this.dy = 0
		}

		this.pos.x += this.dx
		mapLeft = Math.floor((this.pos.x - C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x - 1 + C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.DYNAMITE_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapLeft][mapBottom]){
			this.pos.x -= this.dx
			this.pos.x = Math.floor(this.pos.x/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.DYNAMITE_SIZE/2 + 1
			this.dx = 0
			this.dy = 0
		}else if(mapData[mapRight][mapTop] || mapData[mapRight][mapBottom]){
			this.pos.x -= this.dx
			this.pos.x = (Math.floor(this.pos.x/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.DYNAMITE_SIZE/2
			this.dx = 0
			this.dy = 0
		}
	}

	explode(game) {
		game.entities.remove(this)
		for(var i = 0; i < C.DYNAMITE_FLAMES; i++){
			game.entities.push(new Flame('dynamite', this.pos, Math.random()*2*Math.PI, C.DYNAMITE_FLAMES_TIME_FACTOR))
		}
	}

	render(game, canvas, ctx) {
		var red = Math.floor((1 - this.fuseLength/this.originalFuse) * 255)
		ctx.fillStyle = 'rgb('+red+',0,0)'
		if(this.moveTimer <=0 && this.fuseLength % 500 < 100){
			ctx.fillStyle = 'red'
		}
		ctx.fillRect(
			this.pos.x - C.DYNAMITE_SIZE/2,
			this.pos.y - C.DYNAMITE_SIZE/2,
			C.DYNAMITE_SIZE,
			C.DYNAMITE_SIZE
		)
	}
}

module.exports = Dynamite
