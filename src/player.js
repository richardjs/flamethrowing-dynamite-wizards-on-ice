'use strict'

var C = require('./constants.js')
var Flame = require('./flame.js')
var Goal = require('./goal.js')

class Player {
	constructor(id, pos) {
		this.id = id
		this.type = 'player'
		this.pos = pos
		this.dx = 0
		this.dy = 0

		this.hp = C.PLAYER_HP
		this.goals = 0

		this.keys = {}
		this.angle = 0

		this.flameTimer = 0
		this.recoverTimer = 0

		this.dead = false

		this.name = 'Skater ' + Math.floor(Math.random() * 1000)
	}

	update(game) {
		if(this.dead){
			return
		}

		var mapData = game.map.data
		var mapLeft
		var mapRight
		var mapTop
		var mapBottom

		if(this.keys.up){
			this.dy -= C.PLAYER_ACCELERATION
		}
		if(this.keys.down){
			this.dy += C.PLAYER_ACCELERATION
		}
		if(this.keys.left){
			this.dx -= C.PLAYER_ACCELERATION
		}
		if(this.keys.right){
			this.dx += C.PLAYER_ACCELERATION
		}
	
		if(this.flameTimer > 0){
			this.flameTimer -= 1000/C.GAME_FPS
		}
		if(this.keys.fire && !game.client && this.flameTimer <= 0){
			for(var i = 0; i < C.FLAME_NUM; i++){
				game.entities.push(new Flame(
					this.id,
					this.pos,
					this.angle + (Math.random()*C.FLAME_SPREAD - C.FLAME_SPREAD/2)
				))
			}
			this.flameTimer = C.FLAME_DELAY
			this.dx -= Math.cos(this.angle) * C.FLAME_KNOCKBACK
			this.dy -= Math.sin(this.angle) * C.FLAME_KNOCKBACK
		}

		var speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2))
		if(speed > C.PLAYER_MAX_SPEED){
			var angle = Math.atan2(this.dy, this.dx)
			this.dx = Math.cos(angle) * C.PLAYER_MAX_SPEED
			this.dy = Math.sin(angle) * C.PLAYER_MAX_SPEED
		}

		this.pos.y += this.dy
		mapLeft = Math.floor((this.pos.x - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x -1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapRight][mapTop]){
			this.pos.y -= this.dy
			this.dy = 0
			this.pos.y = Math.floor(this.pos.y/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.PLAYER_SIZE/2
		}
		if(mapData[mapLeft][mapBottom] || mapData[mapRight][mapBottom]){
			this.pos.y -= this.dy
			this.dy = 0
			this.pos.y = (Math.floor(this.pos.y/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.PLAYER_SIZE/2
		}

		this.pos.x += this.dx
		mapLeft = Math.floor((this.pos.x - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapRight = Math.floor((this.pos.x -1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapTop = Math.floor((this.pos.y - C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)
		mapBottom = Math.floor((this.pos.y - 1 + C.PLAYER_SIZE/2)/C.MAP_TILE_SIZE)

		if(mapData[mapLeft][mapTop] || mapData[mapLeft][mapBottom]){
			this.pos.x -= this.dx
			this.dx = 0
			this.pos.x = Math.floor(this.pos.x/C.MAP_TILE_SIZE)*C.MAP_TILE_SIZE + C.PLAYER_SIZE/2
		}
		if(mapData[mapRight][mapTop] || mapData[mapRight][mapBottom]){
			this.pos.x -= this.dx
			this.dx = 0
			this.pos.x = (Math.floor(this.pos.x/C.MAP_TILE_SIZE)+1)*C.MAP_TILE_SIZE - C.PLAYER_SIZE/2
		}

		if(this.recoverTimer > 0){
			this.recoverTimer -= 1000/C.GAME_FPS
		}
		if(this.recoverTimer <= 0 && this.hp < C.PLAYER_HP){
			this.hp++
			this.recoverTimer += C.PLAYER_HP_RECOVER_TIME
		}
	}

	render(game, canvas, ctx) {
		ctx.save()
		ctx.translate(this.pos.x, this.pos.y)
		ctx.rotate(this.angle)

		ctx.fillStyle = '#ffcccc'
		ctx.fillRect(
			C.PLAYER_SIZE/2 - 3,
			-C.PLAYER_SIZE/6,
			6,
			C.PLAYER_SIZE/3
		)
		ctx.fillStyle = 'red'
		if(this.dead){
			ctx.fillStyle = 'black'
		}
		ctx.fillRect(
			-C.PLAYER_SIZE/2,
			-C.PLAYER_SIZE/2,
			C.PLAYER_SIZE,
			C.PLAYER_SIZE
		)

		ctx.restore()
	}

	hit() {
		this.hp--
	}

	die(game){
		this.dead = true
		this.dx = 0
		this.dy = 0
		if(!game.client){
			for(var i = 0; i < this.goals; i++){
				do{
					var x = Math.random() * C.PICKUP_SCATTER*2 - C.PICKUP_SCATTER + this.pos.x
					var y = Math.random() * C.PICKUP_SCATTER*2 - C.PICKUP_SCATTER + this.pos.y
				}while(
					game.map.data[Math.floor(x/C.MAP_TILE_SIZE)][Math.floor(y/C.MAP_TILE_SIZE)]
				)
				game.entities.push(new Goal({x: x, y: y}))
			}
		}
	}
}

module.exports = Player
