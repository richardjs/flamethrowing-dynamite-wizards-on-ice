'use strict'

var ROT = require('rot-js')

var C = require('./constants.js')


function standard(){
	var mapData = []

	var map = new ROT.Map.Digger(C.RUINS_WIDTH, C.RUINS_HEIGHT)
	map.create((x, y, wall) => {
		if(!mapData[x]){
			mapData[x] = []
		}
		mapData[x][y] = wall
	})
	return mapData
}

exports.standard = standard
