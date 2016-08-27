'use strict'

var C = require('./constants.js')
var Game = require('./game.js')
var time = require('./time.js')

var game = new Game()
game.initClient()

time.timer(() => {
	if(!game.map.data) return
	if(!game.localPlayer) return

	var inputState = {
		seqnum: game.input.seqnum++,
		keys: game.input.keys,
		angle: game.input.angle
	}
	game.input.queue.push(inputState)
	game.localPlayer.keys = inputState.keys
	game.localPlayer.angle = inputState.angle
	game.network.socket.emit('input', inputState)
	
	game.update()

	game.display.render()
}, 1000/C.GAME_FPS)
