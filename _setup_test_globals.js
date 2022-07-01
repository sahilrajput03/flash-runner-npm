// @ts-nocheck
console.log('---> Starting test suite <---')

let tests = []
let onlyTests = [] // facilitates to run a list of test.only tests to be run.

global.test = (name, cb) => {
	tests.push({name, cb})
}
global.test.only = (name, cb) => {
	onlyTests.push({name, cb})
}

let descibeSideEffectCountInTests = 0
global.describe = (name, cb) => {
	descibeSideEffectCountInTests = descibeSideEffectCountInTests + 2 // adding two coz we are adding two entries to tests array.

	tests.push({name, isDescribe: true, isStart: true})
	cb() // this will push the tests now
	tests.push({name, isDescribe: true})
}

let testsPasssedCount = 0
const testRunner = async ({name, cb}) => {
	log('\n ⮞ TEST -', name)
	try {
		await cb()
		log('✅ Test Passed ')
		testsPasssedCount++
	} catch (e) {
		log('❌ Test Failed')
		log(e)
	}
}
// FYI :: I WOULD NEED TO RUN RUNTEST MANUALLY IN THE END OF THIS FILE.
const runTests = async () => {
	let testsToRun

	if (onlyTests.length > 0) {
		// Check if user is using some `only` tests, then run `onlyTests`.
		log('----->>>USING TEST.ONLY<<<<----')
		testsToRun = onlyTests
	} else {
		// Otherwise run all tests
		testsToRun = tests
	}

	for await (const test of testsToRun) {
		if (test.isDescribe) {
			if (test.isStart) {
				log('\n\n⮟ Describe -', test.name + '\n' + '_'.repeat(15 + test.name.length))
			} else {
				log('\n⮝ Describe (ending) -', test.name + '\n' + '_'.repeat(15 + 9 + test.name.length) + '\n')
			}
		} else {
			// non-describe-tests
			await testRunner(test)
		}
	}

	// Stats
	log('\nFinished all tests.')

	let TESTS_LENGTH = tests.length - descibeSideEffectCountInTests
	let isAllPassed = TESTS_LENGTH === testsPasssedCount
	let bingo_or_failed_info = isAllPassed ? 'BINGO✅✅✅' : 'Failed: ' + (TESTS_LENGTH - testsPasssedCount) + '❌'

	log('TOTAL:', TESTS_LENGTH + ',', 'Passed:', testsPasssedCount + (isAllPassed ? ',' : '✅,'), bingo_or_failed_info, '\n') // Adding extra space to make it look better.

	tests = [] // IMPORTANT: Empty the tests array so later when we re-run the tests it won't rerun older queued tests.
	onlyTests = [] // IMPORTANT: Empty the tests array so later when we re-run the tests it won't rerun older queued tests.
	testsPasssedCount = 0
	descibeSideEffectCountInTests = 0
}

// This doesn't work man idk why!
// global = {...global, tests, test, testRunner, runTests}
// global = {tests, test, testRunner, runTests}

// What is global in nodejs?
// Ans. https://stackoverflow.com/a/66293366/10012446

global.log = console.log
global.runTests = runTests
// Detect if using flash runner, can be helpful to check tester dynamically in test files to run code conditionally when you may wan to run jest for production testing.
global.isFlashRunner = true
