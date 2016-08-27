'use strict'

var ROT = require('rot-js')

var RUINS_WIDTH = 75
var RUINS_HEIGHT = 75

function makeMap(){
	var mapData = []

	var map = new ROT.Map.Digger(75, 75)
	map.create((x, y, wall) => {
		if(!mapData[x]){
			mapData[x] = []
		}
		mapData[x][y] = wall
	})
	return mapData
}

exports.makeMap = makeMap
