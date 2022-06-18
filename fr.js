#!/usr/bin/env node
let nodemon = require('nodemon')
let path = require('path')

let startTesting = path.join(__dirname, 'startTesting.js')
let log = console.log

// Debug startTesting filepath.
// throw startTesting

// console.log(process.argv)
// process.exit(0)
// Remove first two elements.
process.argv.shift()
process.argv.shift()
let watching = process.argv.includes('-w') || process.argv.includes('--watch')
if (watching) {
	// console.log('here..')
	process.argv = process.argv.filter((arg) => !arg.includes('-w'))
	process.argv = process.argv.filter((arg) => !arg.includes('--watch'))
	// ^^ these two are not redundant ~ Sahil.
	// console.log('here.. argv', process.argv)
}

let codeFile = process.argv[0] // should be test1.test.js / code.js
// console.log(codeFile)
// process.exit(0)

if (!codeFile) {
	console.log('Please provide file as argument...')
	process.exit(0)
}

let configFilePath = path.join(process.cwd(), 'config.fr.js')
// log('joined path::', configFilePath)
let config
let ALLOWED_KEYS = ['refresh', 'debug']

// only watch for changes in filename only and thus persisting connection.
let watch = [startTesting]

const fs = require('fs')
if (fs.existsSync(configFilePath)) {
	try {
		// for sample config.fr.json file look for SAMPLE.config.fr.json file in this folder only.
		// log({configFilePath})
		config = require(configFilePath)

		// Check for valid properties in fr.config.js file.
		Object.keys(config).forEach((key) => {
			if (!ALLOWED_KEYS.includes(key)) throw 'Invalid config key used: `' + key + '`. DID YOU MEAN ANY OF THESE: ' + ALLOWED_KEYS.join(', ')
		})

		// Add files to force reload the server using nodemon on those files changes and thus the sideeffects will be fully reloaded. Yikes!
		watch.push(...config.refresh)
		const {debug: d} = config
		if (d) {
			const isValidDebugValue = d === '' || d === '--inspect' || d === '--inspect-brk'
			if (!isValidDebugValue) {
				const messg = "???  ~Sahil ::ERROR::FLASH RUNNER::In `config.fr.json` file you must set value of `debug` key to one of the following: '', '--inspect', '--inspect-brk'"
				throw messg
			}
		}
	} catch (error) {
		log('::::::::FAILED TO LOAD config.fr.js file!!::::::::: v')
		log({error})
		log('::::::::FAILED TO LOAD config.fr.js file!!::::::::: ^')
	}
} else {
	log('No config file found. Using default config...')
}

// FYI: LEARN: In below code we can use `--inspect-brk` to debug with node to break on the very first line of code too.
// USING --inspect makes the autoattach works so smoothly, yikes! ~ sahil
// config.debug can be --inspect or --inspect-brk
if (watching) {
	nodemon({
		exec: `node ${config ? config.debug : ''} ${startTesting} ${codeFile} -w || exit 0`, // here -w is for consumption for startTesting.js file.
		// exec: `node ${startTesting} ${filename} -w`, // here -w is for consumption for startTesting.js file.
		watch,

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
		console.log('\nBye!! ~ Flash Runner')
	}
}
