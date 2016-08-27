'use strict'

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

		for(var x = 0; x < map.data.length; x++){
			for(var y = 0; y < map.data[x].length; y++){
				this.ctx.fillStyle = 'white'
				if(!map.data[x][y]){
					this.ctx.fillRect(x*3, y*3, 3, 3)
				}
			}
		}
	}
}

module.exports = Display
