'use strict'

var C = require('./constants.js')

exports.centerOfSquare = function(squarePos){
	return {
		x: squarePos.x*C.MAP_TILE_SIZE + C.MAP_TILE_SIZE/2,
		y: squarePos.y*C.MAP_TILE_SIZE + C.MAP_TILE_SIZE/2,
	}
}

exports.pixelToMap = function(pos){
	return {
		x: Math.floor(pos.x / C.MAP_TILE_SIZE),
		y: Math.floor(pos.y / C.MAP_TILE_SIZE)
	}
}

Array.prototype.remove = function(o){
	this.splice(this.indexOf(o), 1)
}
