'use strict'

var C = require('./constants.js')
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

		this.numGoals = 0

		this.client = false
		this.display = null
		this.network = null
		this.id = null
		this.localPlayer = null
	}

	initServer() {
		console.log('making map...')
		this.map.data = mapgen.standard(this.players.length)

		this.numGoals = C.PICKUP_NUM * Math.max(this.players.length, 2) * C.PICKUP_NUM_PLAYERS_FACTOR
		for(var i = 0; i < this.numGoals; i++){
			this.entities.push(new Goal(util.centerOfSquare(this.map.findEmptySquare())))
		}
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
		if(!this.client){
			this.numGoals = 0

			// band-aid so if a goal disappears, we still can win
			for(var entity of this.entities){
				if(entity.type === 'goal'){
					this.numGoals++
				}else if(entity.type === 'player'){
					this.numGoals += entity.goals
				}
			}
		}
	}
}

module.exports = Game
