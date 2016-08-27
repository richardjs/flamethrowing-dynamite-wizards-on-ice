'use strict'

var C = require('./constants.js')
var Flame = require('./flame.js')
var Goal = require('./goal.js')
var Player = require('./player.js')
var time = require('./time.js')

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
