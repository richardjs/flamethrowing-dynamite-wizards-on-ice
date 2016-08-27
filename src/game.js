'use strict'

var Display = require('./display.js')
var Map = require('./map.js')
var Network = require('./network.js')
var Player = require('./player.js')
var Input = require('./input.js')

class Game {
	constructor() {
		this.map = new Map(this)

		this.entities = []

		this.client = false
		this.display = null
		this.network = null
		this.id = null
		this.localPlayer = null
	}

	initClient() {
		this.client = true
		this.display = new Display(this)
		this.network = new Network(this)
		this.input = new Input(this)
	}

	update() {
		for(var entity of this.entities){
			entity.update(this)
		}
	}
}

module.exports = Game
