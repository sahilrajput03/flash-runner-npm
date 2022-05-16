#!/usr/bin/env node
let nodemon = require('nodemon')
let path = require('path')

let startTesting = path.join(__dirname, 'startTesting.js')

// Debug startTesting filepath.
// throw startTesting

// console.log(process.argv)
// process.exit(0)
// Remove first two elements.
process.argv.shift()
process.argv.shift()
let watching = process.argv.includes('-w') || process.argv.includes('--watch')
if (watching) {
	process.argv = process.argv.filter((arg) => !arg.includes('-w') || !arg.includes('--watch'))
}

let codeFile = process.argv[0] // should be code.js
// console.log(codeFile)
// process.exit(0)

if (!codeFile) {
	console.log('Please provide file as argument...')
	process.exit(0)
}

if (watching) {
	nodemon({
		exec: `node ${startTesting} ${codeFile} -w`, // here -w is for consumption for startTesting.js file.
		// exec: `node ${startTesting} ${filename} -w`, // here -w is for consumption for startTesting.js file.
		watch: [startTesting], // only watch for changes in filename only and thus persisting connection.

		// ext: 'js json',
		// ext: '',
	})

	nodemon
		.on('start', function () {
			console.log('App has started')
		})
		.on('quit', function () {
			console.log('Have a nice day ~ flash runner')
			process.exit()
		})
		.on('restart', function (files) {
			console.log('App restarted due to: ', files)
		})
} else {
	const {execSync} = require('child_process')

	// `options` src: https://stackoverflow.com/a/31104898/10012446
	const options = {stdio: 'inherit'}
	// TODO: Add about ^^ this flag in new snips in nodejs snips, yikes!!!??
	//

	try {
		execSync(`node ${startTesting} ${codeFile}`, options).toString()
	} catch (error) {
		console.log('Oops, failed to start testing.. ~ Sahil')
	}
}
