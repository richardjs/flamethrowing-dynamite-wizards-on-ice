'use strict'

class Map {
	constructor(game) {
		this.game = game
		this.data = []
	}

	findEmptySquare() {
		var x, y
		do{
			x = Math.floor(Math.random()*this.data.length)
			y = Math.floor(Math.random()*this.data[x].length)
		}while(this.data[x][y])
		return {x: x, y: y}
	}
}

module.exports = Map
