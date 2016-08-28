'use strict'

var C = require('./constants.js')
var Game = require('./game.js')
var time = require('./time.js')

var game = new Game()
game.initClient()

function rename(){
	do{
		var name = prompt('What is your name, o wizard?')
		if(name){
			name = name.trim()
		}else if(name === null){
			name = 'The Nameless Skater'
		}
	}while(!name.length)
	localStorage.setItem('name', name)
	game.network.socket.emit('name', name)
}

while(!localStorage.getItem('name')){
	rename()
}
game.network.socket.emit('name', localStorage.getItem('name'))

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

	if(game.input.keys.name){
		rename()
	}
}, 1000/C.GAME_FPS)
