'use strict'

var C = require('./constants.js')
var Game = require('./game.js')
var time = require('./time.js')

var game = new Game()
game.initClient()

function rename(){
	var name = prompt('What is your name, o wizard?')
	if(name && name.length){
		name = name.trim()
	}else{
		name = 'Skater ' + Math.floor(Math.random() * 1000)
	}
	localStorage.setItem('name', name)
	game.network.socket.emit('name', name)
}

if(!localStorage.getItem('name')){
	rename()
}
game.network.socket.emit('name', localStorage.getItem('name'))

time.timer(() => {
	if(!game.map.data) return
	if(!game.localPlayer) return

	var inputState = {
		seqnum: game.input.seqnum++,
		keys: game.input.keys,
		angle: game.input.angle,
		mouse: game.input.mouse
	}
	game.input.queue.push(inputState)
	game.localPlayer.keys = inputState.keys
	game.localPlayer.angle = inputState.angle
	game.network.socket.emit('input', inputState)
	
	game.update()

	game.display.render()

	if(game.input.keys.name){
		rename()
		game.input.keys.name = false
	}
}, 1000/C.GAME_FPS)
