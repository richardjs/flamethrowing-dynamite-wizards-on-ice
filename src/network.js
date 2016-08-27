'use strict'

var C = require('./constants.js')
var Flame = require('./flame.js')
var Goal = require('./goal.js')
var Player = require('./player.js')
var time = require('./time.js')

var interpolationQueues = {}

class Network {
	constructor(game) {
		this.game = game
		this.socket = io()

		this.socket.on('id', id => {
			this.game.id = id
		})

		this.socket.on('mapData', mapData => {
			this.game.map.data = mapData
		})

		this.socket.on('update', state => {
			this.game.entities = []
			this.game.players = []
			for(var data of state.entities){
				var entity;
				switch(data.type){
					case 'player':
						entity = new Player()
						this.game.players.push(entity)
						break
					case 'goal':
						entity = new Goal()
						break
					case 'flame':
						entity = new Flame()
						break
				}
				for(var property in data){
					entity[property] = data[property]
				}

				if(entity.id){
					if(!interpolationQueues[entity.id]){
						interpolationQueues[entity.id] = []
					}
					interpolationQueues[entity.id].push(entity.pos)
					while(interpolationQueues[entity.id].length > C.INTERPOLATION_FRAMES){
						interpolationQueues[entity.id].shift()
					}
					var interpolatedPos = {x: 0, y: 0}
					for(var pos of interpolationQueues[entity.id]){
						interpolatedPos.x += pos.x
						interpolatedPos.y += pos.y
					}
					interpolatedPos.x /= interpolationQueues[entity.id].length
					interpolatedPos.y /= interpolationQueues[entity.id].length
					entity.pos = interpolatedPos
				}

				this.game.entities.push(entity)

				if(entity.id === this.game.id){
					this.game.localPlayer = entity
				}
			}

			while(game.input.queue.length && game.input.queue[0].seqnum <= state.seqnum){
				game.input.queue.shift()
			}
			for(var input of game.input.queue){
				game.localPlayer.keys = input.keys
				game.update()
			}
		})
	}
}

module.exports = Network
