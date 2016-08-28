'use strict'

var C = require('./constants')
var util = require('./util')

class Display {
	constructor(game) {
		this.game = game
		this.canvas = document.createElement('canvas')
		this.ctx = this.canvas.getContext('2d')
		document.body.appendChild(this.canvas)

		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		window.addEventListener('resize', () => {
			this.canvas.width = window.innerWidth
			this.canvas.height = window.innerHeight
		})
	}

	render(){
		this.ctx.fillStyle = '#323242'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.ctx.save()
		this.ctx.translate(
			Math.floor(this.canvas.width/2 - this.game.localPlayer.pos.x),
			Math.floor(this.canvas.height/2 - this.game.localPlayer.pos.y)
		)

		for(var x = 0; x < this.game.map.data.length; x++){
			for(var y = 0; y < this.game.map.data[x].length; y++){
				this.ctx.fillStyle = '#cceeff'
				if(!this.game.map.data[x][y]){
					this.ctx.fillRect(
						x*C.MAP_TILE_SIZE,
						y*C.MAP_TILE_SIZE,
						C.MAP_TILE_SIZE,
						C.MAP_TILE_SIZE
					)
				}
			}
		}
		this.ctx.restore()

		this.ctx.save()
		this.ctx.translate(
			this.canvas.width/2 - this.game.localPlayer.pos.x,
			this.canvas.height/2 - this.game.localPlayer.pos.y
		)

		for(var entity of this.game.entities) {
			var mapPos = util.pixelToMap(entity.pos)
			if(C.OCCLUSION_ALPHA === 1 && !this.game.localPlayer.view[mapPos.x] || !this.game.localPlayer.view[mapPos.x][mapPos.y]) continue
			entity.render(this.game, this.canvas, this.ctx)
		}

		this.ctx.restore()

		this.ctx.globalAlpha = .7
		for(var player of this.game.players){
			var mapPos = util.pixelToMap(player.pos)
			if(C.OCCLUSION_ALPHA === 1 && !this.game.localPlayer.view[mapPos.x] || !this.game.localPlayer.view[mapPos.x][mapPos.y]) continue

			//health bar
			this.ctx.fillStyle = '#222'
			this.ctx.fillRect(
				player.pos.x - this.game.localPlayer.pos.x + this.canvas.width/2 - C.PLAYER_SIZE*1.5/2,
				player.pos.y - C.PLAYER_SIZE/2 - 20 - this.game.localPlayer.pos.y + this.canvas.height/2,
				C.PLAYER_SIZE*1.5,
				5
			)
			var hpPercent = Math.max(player.hp / C.PLAYER_HP, 0)
			if(hpPercent > .66){
				this.ctx.fillStyle = 'green'
			}else if(hpPercent > .33){
				this.ctx.fillStyle = 'yellow'
			}else{
				this.ctx.fillStyle = 'red'
			}
			this.ctx.fillRect(
				player.pos.x - this.game.localPlayer.pos.x + this.canvas.width/2 - C.PLAYER_SIZE*1.5/2,
				player.pos.y - C.PLAYER_SIZE/2 - 19 - this.game.localPlayer.pos.y + this.canvas.height/2,
				C.PLAYER_SIZE*1.5 * hpPercent,
				3
			)

			// name
			this.ctx.font = '12pt courier'
			this.ctx.fillStyle = '#777'
			this.ctx.textAlign = 'center'
			this.ctx.fillText(
				player.name,
				player.pos.x - this.game.localPlayer.pos.x + this.canvas.width/2,
				player.pos.y + C.PLAYER_SIZE/2 + 25 - this.game.localPlayer.pos.y + this.canvas.height/2
			)
		}

		// occlusion
		if(C.OCCLUSION_ALPHA > 0){
			this.ctx.save()
			this.ctx.translate(
				Math.floor(this.canvas.width/2 - this.game.localPlayer.pos.x),
				Math.floor(this.canvas.height/2 - this.game.localPlayer.pos.y)
			)

			this.ctx.globalAlpha = C.OCCLUSION_ALPHA
			this.ctx.fillStyle = C.OCCLUSION_COLOR
			for(var x = 0; x < this.game.map.data.length; x++){
				for(var y = 0; y < this.game.map.data[x].length; y++){
					if(!this.game.localPlayer.view[x] || !this.game.localPlayer.view[x][y]){
						if(!this.game.map.data[x][y]){
							this.ctx.fillRect(
								x*C.MAP_TILE_SIZE,
								y*C.MAP_TILE_SIZE,
								C.MAP_TILE_SIZE,
								C.MAP_TILE_SIZE
							)
						}
					}
				}
			}

			for(var entity of this.game.entities) {
				if(entity.type === 'goal'){
					entity.render(this.game, this.canvas, this.ctx)
				}
			}

			this.ctx.restore()
		}
		
		// scoreboard
		var sorted = []
		for(var player of this.game.players){
			var i
			for(i = 0; i < sorted.length; i++){
				if(player.goals > sorted[i].goals) break
			}
			sorted.splice(i, 0, player)
		}
		this.ctx.font = '14pt arial'
		this.ctx.fillStyle = '#777'
		this.ctx.textAlign = 'right'
		var y = 20
		for(var player of sorted){
			this.ctx.fillText(
				player.name + ' ' + player.goals,
				this.canvas.width - 10,
				y
			)
			y += 20
		}

		var numGoals = 0;
		var goalAngles = []
		for(var entity of this.game.entities){
			if(entity.type !== 'goal') continue
			numGoals++
			goalAngles.push(Math.atan2(
				entity.pos.y - this.game.localPlayer.pos.y,
				entity.pos.x - this.game.localPlayer.pos.x
			))
		}
		this.ctx.fillStyle = '#707'
		this.ctx.fillText(
			'Remaining ' + numGoals,
			this.canvas.width - 10,
			y
		)

		// radar
		for(var angle of goalAngles){
			var offsetX = 50*Math.cos(angle) - 0*Math.sin(angle);
			var offsetY = 50*Math.sin(angle) + 0*Math.cos(angle);
			this.ctx.beginPath()
			this.ctx.arc(
				this.canvas.width/2 + offsetX,
				this.canvas.height/2 + offsetY,
				2, 0, Math.PI*2
			)
			this.ctx.fill()
		}
		for(var player of sorted){
			if(player === this.game.localPlayer) continue
			if(player.goals === 0) continue
			var angle = Math.atan2(
				player.pos.y - this.game.localPlayer.pos.y,
				player.pos.x - this.game.localPlayer.pos.x
			)
			var offsetX = 60*Math.cos(angle) - 0*Math.sin(angle)
			var offsetY = 60*Math.sin(angle) + 0*Math.cos(angle)
			this.ctx.beginPath()
			this.ctx.arc(
				this.canvas.width/2 + offsetX,
				this.canvas.height/2 + offsetY,
				3, 0, Math.PI*2
			)
			this.ctx.fill()
			break
		}

		// fuse set meter
		for(var player of this.game.players){
			if(player.fuseTimer === 0) continue

			var fusePercent = (player.fuseTimer % C.DYNAMITE_FUSE_SELECT_TIME) / C.DYNAMITE_FUSE_SELECT_TIME
			if(Math.floor(player.fuseTimer / C.DYNAMITE_FUSE_SELECT_TIME) % 2 == 1){
				fusePercent = 1 - fusePercent
			}
			
			this.ctx.fillStyle = '#aaa'
			this.ctx.fillRect(
				player.pos.x - this.game.localPlayer.pos.x + this.canvas.width/2 + C.PLAYER_SIZE/2 + 20,
				player.pos.y - C.PLAYER_SIZE/2 - this.game.localPlayer.pos.y + this.canvas.height/2,
				5,
				C.PLAYER_SIZE
			)
			this.ctx.fillStyle = '#211'
			this.ctx.fillRect(
				player.pos.x - this.game.localPlayer.pos.x + this.canvas.width/2 + C.PLAYER_SIZE/2 + 20,
				player.pos.y - C.PLAYER_SIZE/2 - this.game.localPlayer.pos.y + this.canvas.height/2 + C.PLAYER_SIZE*fusePercent,
				5,
				C.PLAYER_SIZE*(1-fusePercent)
			)

		}

		this.ctx.globalAlpha = 1
	}
}

module.exports = Display
