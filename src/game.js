'use strict'

var Display = require('./display.js')
var Map = require('./map.js')
var Network = require('./network.js')

class Game {
	constructor() {
		this.display = new Display(this)
		this.map = new Map(this)
		this.network = new Network(this)
	}

	run() {
		var game = this;
		var lastTime;
		function frame(time){
			requestAnimationFrame(frame)
			if(lastTime === undefined){
				lastTime = time
				return
			}
			var delta = time - lastTime
			lastTime = time
				
			if(!game.map.data){
				return
			}
			if(!game.playerPos){
				return
			}

			game.display.render(game.map)
		}
		requestAnimationFrame(frame)
	}
}

module.exports = Game
