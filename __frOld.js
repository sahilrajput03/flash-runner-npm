#!/usr/bin/env node
// file name means `Flash Runner`
// console.log('i am from flash runner file..')
let nodemon = require('nodemon')
// console.log(process.cwd())

let filename = process.argv[2]
if (!filename) {
	console.log('Please provide file as argument...')
	process.exit(0)
}

nodemon(`-w ./startTesting.js -x 'node ./startTesting -w || exit 0'`)
