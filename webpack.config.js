const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
	entry: {
		SliderTools: './src/index.js',
	},
	output: {
		filename: '[name].js',
		library: 'SliderTools',
		libraryTarget: 'umd',
		libraryExport: 'default',
	},
	target: ['web', 'es5'],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',

						options: {
							importLoaders: 1,
						},
					},
					'postcss-loader',
				],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				include: /\.min\.js$/,
			}),
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: '拖动滑块验证',
			filename: 'index.html',
			template: './public/index.html',
			scriptLoading: 'blocking',
			inject: 'head',
			minify: false,
			host: '0.0.0.0',
		}),
		new CleanWebpackPlugin(),
	],
	devServer: {
		port: 9000,
		open: true,
	},
}

module.exports = config
