// @ts-nocheck
let log = console.log
let tests = []
// let describes = []

global.test = (name, cb) => {
	tests.push({name, cb})
}
global.describe = (name, cb) => {
	tests.push({name, isDescribe: true, isStart: true})
	cb() // this will push the tests now
	tests.push({name, isDescribe: true})
}

const testRunner = async ({name, cb}) => {
	log('\n▢ TEST -', name)
	try {
		await cb()
		log('✅ Test Passed ')
	} catch (e) {
		log(e)
		log('❌ Test Failed')
	}
}
test('test1-top', async () => {
	log('is 1 equals 1', 1 === 1)
})
describe('my description', async () => {
	test('test1-desc', async () => {
		log('is 2 equals 2', 2 === 2)
	})

	test('test2-desc', async () => {
		log('is 2 equals 2', 2 === 2)
	})
})
test('test3-top', async () => {
	log('is 3 equals 3', 3 === 3)
})

//? EXEUTION OF TESTS
async function main() {
	let testsToRun = tests
	for await (const test of testsToRun) {
		if (test.isDescribe) {
			if (test.isStart) {
				log('\n\n▢▢▢ Describe -', test.name + '\n' + '>'.repeat(12 + test.name.length))
			} else {
				log('\n▢▢▢ Describe -', test.name, '\n' + '<'.repeat(12 + test.name.length) + '\n')
			}
		} else {
			// non-describe-tests
			await testRunner(test)
		}
	}
}
main()
