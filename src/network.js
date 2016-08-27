'use strict'

var C = require('./constants.js')

class Network {
	constructor(game) {
		this.game = game
		this.socket = io()

		this.socket.on('mapData', mapData => {
			this.game.map.data = mapData
		})

		this.socket.on('playerPos', playerPos => {
			this.game.playerPos = playerPos
		})
	}
}

module.exports = Network
