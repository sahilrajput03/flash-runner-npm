#!/usr/bin/env node
let nodemon = require('nodemon')
let path = require('path')

let startTestingJs = path.join(__dirname, 'startTesting.js')
let _setup_test_globalsPath = path.join(__dirname, '_setup_test_globals.js')

let log = console.log

// Debug startTesting filepath.
// throw startTesting

// console.log(process.argv)
// process.exit(0)
// Remove first two elements.
process.argv.shift()
process.argv.shift()
let isWatching = process.argv.includes('-w') || process.argv.includes('--watch')
if (isWatching) {
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
let watchDefaults = [startTestingJs, _setup_test_globalsPath, configFilePath]

const fs = require('fs')

const loadConfigFile = () => {
	if (fs.existsSync(configFilePath)) {
		// LEARN: Clear module cache for config.fr.js file coz I added the live-reload functionality for the config file as well.
		let moduleConfigFile = require.resolve(configFilePath)
		// log({moduleConfigFile}) // debug
		delete require.cache[moduleConfigFile]
		// process.exit(0) // debug

		try {
			// for sample config.fr.json file look for SAMPLE.config.fr.json file in this folder only.
			// log({configFilePath})

			config = require(configFilePath)

			// Debugging
			// setTimeout(() => {
			// 	log('here')
			// 	log({config})
			// }, 2000)

			// Check for valid properties in fr.config.js file.
			Object.keys(config).forEach((key) => {
				if (!ALLOWED_KEYS.includes(key)) {
					console.log('Invalid config key used: `' + key + '`. DID YOU MEAN ANY OF THESE: ' + ALLOWED_KEYS.join(', '))
				}
			})

			const {debug: d} = config
			if (d) {
				const isValidDebugValue = d === '' || d === '--inspect' || d === '--inspect-brk'
				if (!isValidDebugValue) {
					const messg =
						"???  ~Sahil ::ERROR::FLASH RUNNER::In `config.fr.js` file you must set value of `debug` key to one of the following: '', '--inspect', '--inspect-brk'"
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
}

// MANGAGING RUNNING OF TEST FILE ON THE BASIS OF IF ITS OUR COMIPER IS **WATHCING** OR NOT
if (isWatching) {
	setupNodemon()
} else {
	const {execSync} = require('child_process')

	// `options` src: https://stackoverflow.com/a/31104898/10012446
	const options = {stdio: 'inherit'}
	// TODO: Add about ^^ this flag in new snips in nodejs snips, yikes!!!??

	try {
		// @ts-ignore
		execSync(`node ${startTestingJs} ${codeFile}`, options).toString()
	} catch (error) {
		console.log('\nBye!! ~ Flash Runner')
	}
}

// FYI: LEARN: In below code we can use `--inspect-brk` to debug with node to break on the very first line of code too.
// USING --inspect makes the autoattach works so smoothly, yikes! ~ sahil
// config.debug can be --inspect or --inspect-brk
function setupNodemon() {
	// load configFile in `config` binding on startup.
	loadConfigFile()

	// Add files to force reload the server using nodemon on those files changes and thus the sideeffects will be fully reloaded. Yikes!
	const watch = watchDefaults
	if (config?.refresh) {
		watch.push(...config.refresh)
	}

	nodemon({
		exec: `node ${config ? config.debug : ''} ${startTestingJs} ${codeFile} -w || exit 0`, // here -w is for consumption for startTesting.js file.
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
			log('Completed reset on nodemon child process!') //? #101_FEAT: I handle the reloading of config file and then restarting the nodemon on `quit` event handler.

			// Check if nodemon child process is running
			// log({run: nodemon.config.run})

			nodemon.reset(() => {
				setupNodemon()
			})

			// process.exit(0)
		})
		.on('restart', function (files) {
			console.log('App restarted due to: ', files)

			//? Live loading of config file starts here!
			// @ts-ignore
			const wasConfigFile = files.findIndex((fl) => fl.includes('config.fr.js')) > -1
			console.log('yo??', wasConfigFile)
			if (wasConfigFile) {
				nodemon.emit('quit') //? #101_FEAT: I handle the reloading of config file and then restarting the nodemon on `quit` event handler.
			}
		})
}
