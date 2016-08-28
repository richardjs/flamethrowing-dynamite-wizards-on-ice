'use strict'

var C = require('./constants')

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
		this.ctx.fillStyle = 'black'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.ctx.save()
		this.ctx.translate(
			Math.floor(this.canvas.width/2 - this.game.localPlayer.pos.x),
			Math.floor(this.canvas.height/2 - this.game.localPlayer.pos.y)
		)

		for(var x = 0; x < this.game.map.data.length; x++){
			for(var y = 0; y < this.game.map.data[x].length; y++){
				this.ctx.fillStyle = 'white'
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
			entity.render(this.game, this.canvas, this.ctx)
		}

		this.ctx.restore()

		for(var player of this.game.players){
			this.ctx.font = '12pt courier'
			this.ctx.fillStyle = '#777'
			this.ctx.textAlign = 'center'
			this.ctx.fillText(
				player.name,
				player.pos.x - this.game.localPlayer.pos.x + this.canvas.width/2,
				player.pos.y + C.PLAYER_SIZE/2 + 25 - this.game.localPlayer.pos.y + this.canvas.height/2
			)
		}
	}
}

module.exports = Display
