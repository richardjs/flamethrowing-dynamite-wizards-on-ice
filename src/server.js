'use strict'

var express = require('express')
var http = require('http')
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
	socket.player = new Player(socket.id, playerPos)
	game.entities.push(socket.player)
	game.players.push(socket.player)
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
	sockets.push(socket)
	socket.on('disconnect', () => {
		console.log('disconnect ' + socket.id)
		sockets.remove(socket)
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
	})

	socket.id = UUID.v4()
	console.log('connect ' + socket.id)
	socket.emit('id', socket.id)
	socket.emit('mapData', game.map.data)

	newPlayer(socket)
})

time.timer(() => {
	game.update()
	for(var socket of sockets){
		if(socket.player.hp <= 0){
			socket.player.die(game)
			var name = socket.player.name
			game.entities.remove(socket.player)
			game.players.remove(socket.player)
			newPlayer(socket)
			socket.player.name = name
		}
		if(socket.player.goals == game.numGoals){
			newGame()
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
