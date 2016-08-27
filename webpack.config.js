module.exports = {
	entry: './src/client.js',
	output: {
		filename: 'build/bundle.js'
	},
	module: {
		loaders: [
			{test: /\.js$/, loader: 'babel-loader'}
		]
	}
}
