'use strict'

var ROT = require('rot-js')

var C = require('./constants.js')


function standard(numPlayers){
	if(numPlayers < 2){
		numPlayers = 2
	}

	var mapData = []

	var map = new ROT.Map.Digger(
		C.RUINS_WIDTH * numPlayers * C.RUINS_SIZE_PLAYERS_FACTOR,
		C.RUINS_HEIGHT * numPlayers * C.RUINS_SIZE_PLAYERS_FACTOR
	)
	map.create((x, y, wall) => {
		if(!mapData[x]){
			mapData[x] = []
		}
		mapData[x][y] = wall
	})
	return mapData
}

exports.standard = standard
