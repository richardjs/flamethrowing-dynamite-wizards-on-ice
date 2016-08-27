'use strict'

class Network {
	constructor(game) {
		this.game = game
		this.socket = io()

		this.socket.on('mapData', mapData => {
			this.game.map.data = mapData
		})
	}
}

module.exports = Network
