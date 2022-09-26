// @ts-nocheck
// require('./_setup_test_globals.js')
// require('flash') // I linked to this local _setup_test_globas.js file using `npm link`, so you might need to run `npm link flash` in this project once to make it work with npm.
require('./_setupGlobals')

require('hot-module-replacement')({
	ignore: /node_modules/,
})

// Check if user passed -w or --watch flag
let watching = process.argv.includes('-w') || process.argv.includes('--watch')
// console.log({watching})

let beforeAllFn = () => {}
global.beforeAll = (cb) => {
	beforeAllFn = cb
}

let closeDbFn = () => {}
global.closeDb = (cb) => {
	closeDbFn = cb
}

const emptyFn = () => {}

let connected = false
let connectToDbCalled = false
global.persistConnection = null
global.connectToDb = async (cb = emptyFn) => {
	connectToDbCalled = true // this is useful to track if our test file is calling `connectToDb` or not. It is useful in testing files (i.e., simple tests) where we don't want to call `connectToDb` global function in our test files.
	if (connected) return

	await cb()
	connected = true

	// Run beforeAll method (FYI: See LEARN*1)
	await beforeAllFn()

	// We're ready to run tests now coz connection is successful
	await runTests()

	if (!watching) {
		await closeDbFn()
	} else {
		keepEventLoopBusy()
	}
}

let filename = process.argv[2]
// console.log({filename})
// process.exit(0)
if (!filename) {
	console.log('Please provide file as argument...')
	process.exit(0)
}

let filepath = require('path').join(process.cwd(), filename)
// log({filepath})
// process.exit(0)

// running codejs here..
// require('./code.js')
require(filepath)

// Run tests directly when `connectToDb` fn is not called in our test file 26 Sep, 2022.
// THIS IS USEFUL WHEN WE DON"T WANT TO CALL `connectToDb` coz lets say we don't have connection to db yet.
if (!connectToDbCalled) {
	runTests()
	if (watching) {
		keepEventLoopBusy()
	}
}

if (module.hot) {
	// console.log('here....')
	module.hot.accept(filepath, async () => {
		// LEARN: This callack is run only after code.js is loaded!

		// RE-RUN BEFOREALL BEFORE RUNNING TESTSUITE
		// LEARN*1: I run beforeAll even when the connection is active, this is beneficial say when you want your dbs or collecitons to cleared off.
		clearLogs() // Learn: Using clearLogs here helps us print logs of beforeAll on each execution as well. Yikes!
		await beforeAllFn()

		runTests()
	})
}

function clearLogs() {
	// Clear the output of previous tests  ~ Sahil
	console.clear()

	// Clearn tmux-scroll history
	const {execSync} = require('child_process')
	// execSync('tmux clear-history', {stdio: 'pipe'})
	// This is true craziness!

	try {
		execSync('tmux clear-history -t $(tmux display -pt "${TMUX_PANE:?}" "#{pane_index}")', {stdio: 'pipe'})
		// LEARN: Please keep this ^^ line always before the below line!
		execSync('badCommand', {stdio: 'pipe'}) // mimic for people who don't have tmux installed should also be able to run without errors!
	} catch (error) {}
}

function keepEventLoopBusy() {
	// Keep the event loop busy with minimal load!
	setTimeout(() => {}, 24 * 60 * 60 * 1000) // 24hrs
	// Another way to keep the event loop busy, src: https://stackoverflow.com/a/72629264
	// require('fs').createReadStream('package.json').pause();
}
