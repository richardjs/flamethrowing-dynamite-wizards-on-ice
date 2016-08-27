'use strict'

var express = require('express')
var http = require('http')

var map = require('./mapgen.js')

var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server)

app.use('/build', express.static('build'))
app.use(express.static('static'))

console.log('making map...')
var mapData = map.makeMap()

io.on('connection', socket => {
	socket.emit('mapData', mapData)
})

server.listen(5050, () => {
	console.log('listening...')
})
