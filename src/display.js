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

	render(map){
		this.ctx.fillStyle = 'black'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.ctx.save()
		this.ctx.translate(
			Math.floor(this.canvas.width/2 - this.game.playerPos.x),
			Math.floor(this.canvas.height/2 - this.game.playerPos.y)
		)

		for(var x = 0; x < map.data.length; x++){
			for(var y = 0; y < map.data[x].length; y++){
				this.ctx.fillStyle = 'white'
				if(!map.data[x][y]){
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

		this.ctx.fillStyle = 'red'
		this.ctx.fillRect(this.canvas.width/2 - 10, this.canvas.height/2 - 10, 20, 20)
	}
}

module.exports = Display
