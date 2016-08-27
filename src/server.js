'use strict'

var express = require('express')
var http = require('http')

var Map = require('./map.js')
var mapgen = require('./mapgen.js')
var util = require('./util.js')

var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server)

app.use('/build', express.static('build'))
app.use(express.static('static'))

console.log('making map...')
var map = new Map()
map.data = mapgen.standard()

io.on('connection', socket => {
	console.log('connect')
	socket.emit('mapData', map.data)
	var playerPos = util.centerOfSquare(map.findEmptySquare())
	socket.emit('playerPos', playerPos)
})

server.listen(5050, () => {
	console.log('listening...')
})
