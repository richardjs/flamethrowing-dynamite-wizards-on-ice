'use strict'

var C = require('./constants.js')

exports.centerOfSquare = function(squarePos){
	return {
		x: squarePos.x*C.MAP_TILE_SIZE + C.MAP_TILE_SIZE/2,
		y: squarePos.y*C.MAP_TILE_SIZE + C.MAP_TILE_SIZE/2,
	}
}


