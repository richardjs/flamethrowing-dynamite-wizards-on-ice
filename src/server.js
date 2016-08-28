'use strict'

var express = require('express')
var http = require('http')
var ROT = require('rot-js')
var UUID = require('uuid')

var C = require('./constants.js')
var Game = require('./game.js')
var Player = require('./player.js')
var time = require('./time.js')
var util = require('./util.js')

var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server)

app.use('/build', express.static('build'))
app.use(express.static('static'))

console.log('initializing game...')

var game
var sockets = []

function newPlayer(socket){
	var playerPos = util.centerOfSquare(game.map.findEmptySquare())
	var name;
	if(socket.player){
		name = socket.player.name
	}
	socket.player = new Player(socket.id, playerPos)
	game.entities.push(socket.player)
	game.players.push(socket.player)
	if(name){
		socket.player.name = name
	}
	updateView(socket.player)
}

function updateView(player){
	var fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
		return !game.map.data[x] || !game.map.data[x][y]
	})
	player.view = []

	var mapPos = util.pixelToMap(player.pos)

	fov.compute(mapPos.x, mapPos.y, 10, (x, y, r, visibility) => {
		if(!player.view[x]){
			player.view[x] = []
		}
		player.view[x][y] = true
	});
}

function newGame(){
	game = new Game()
	game.initServer()
	for(var socket of sockets){
		newPlayer(socket)
		socket.emit('mapData', game.map.data)
	}
}
newGame()

io.on('connection', socket => {
	if(sockets.length >= C.MAX_PLAYERS){
		socket.emit('full')
		socket.disconnect()
		return;
	}
	sockets.push(socket)
	socket.on('disconnect', () => {
		console.log('disconnect ' + socket.id)
		sockets.remove(socket)
		socket.player.die(game)
		game.entities.remove(socket.player)
		game.players.remove(socket.player)
	})

	socket.on('name', name => {
		socket.player.name = name.substr(0, 30)
	})

	socket.on('input', state => {
		socket.seqnum = state.seqnum
		socket.player.keys = state.keys
		socket.player.angle = state.angle
		socket.player.mouse = state.mouse || {x: 0, y: 0}
	})

	socket.id = UUID.v4()
	console.log('connect ' + socket.id)
	socket.emit('id', socket.id)
	socket.emit('mapData', game.map.data)

	newPlayer(socket)
})

time.timer(() => {
	for(var socket of sockets){
		socket.player.lastMapPos = util.pixelToMap(socket.player.pos)
	}

	game.update()

	for(var socket of sockets){
		if(socket.player.hp <= 0 && !socket.player.dead){
			socket.player.die(game)
			setTimeout(function(s){
				var name = s.player.name
				game.entities.remove(s.player)
				game.players.remove(s.player)
				newPlayer(s)
				s.player.name = name
			}, C.RESPAWN, socket)
			continue
		}
		if(socket.player.goals === game.numGoals && !game.winner){
			for(var s of sockets){
				s.emit('winner', socket.player.name)
			}
			game.winner = socket.player.name
			setTimeout(newGame, 5*1000)
			break
		}

		if(C.OCCLUSION_ALPHA === 0){
			socket.player.view = []
			continue
		}
		var mapPos = util.pixelToMap(socket.player.pos)
		if(socket.player.lastMapPos){
			if(mapPos.x !== socket.player.lastMapPos.x
					|| mapPos.y !== socket.player.lastMapPos.y){
				updateView(socket.player)
			}
		}
	}
}, 1000/C.GAME_FPS)

time.timer(() => {
	for(var socket of sockets){
		socket.volatile.emit('update', {
			seqnum: socket.seqnum,
			entities: game.entities
		})
	}
}, 1000/C.NETWORK_FPS)

server.listen(5050, () => {
	console.log('listening...')
})
