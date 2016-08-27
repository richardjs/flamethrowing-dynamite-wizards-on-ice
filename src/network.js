'use strict'

var C = require('./constants.js')
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

		this.socket.on('entities', entities => {
			this.game.entities = []
			for(var state of entities){
				var entity;
				switch(state.type){
					case 'player':
						entity = new Player()
						break
				}
				for(var property in state){
					entity[property] = state[property]
				}
				this.game.entities.push(entity)

				if(entity.id === this.game.id){
					this.game.localPlayer = entity
				}
			}
		})
	}
}

module.exports = Network
