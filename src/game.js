'use strict'

var Display = require('./display.js')
var Goal = require('./goal.js')
var Input = require('./input.js')
var Map = require('./map.js')
var Network = require('./network.js')
var Player = require('./player.js')
var mapgen = require('./mapgen.js')
var util = require('./util.js')

class Game {
	constructor() {
		this.map = new Map(this)

		this.entities = []
		this.players = []

		this.client = false
		this.display = null
		this.network = null
		this.id = null
		this.localPlayer = null
	}

	initServer() {
		console.log('making map...')
		this.map.data = mapgen.standard(this.players.length)

		this.entities.push(new Goal(util.centerOfSquare(this.map.findEmptySquare())))
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
