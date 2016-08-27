'use strict'

var ROT = require('rot-js')

var express = require('express')
var http = require('http')

var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server)

app.use('/build', express.static('build'))
app.use(express.static('static'))

server.listen(5050, () => {
	console.log('listening...')
})
