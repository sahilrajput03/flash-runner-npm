# Readme

Implementation (with hot) @

- latestImplementation@testing-hot-flash-express-sequelize -> [fso-part13](https://github.com/sahilrajput03/learning_sql/tree/main/fso-part13/exercise-13.4-blogs)
- latestImplementation@[testing-hot-flash-express-mongo](https://github.com/sahilrajput03/learn-express/tree/main/testing-hot-flash-express-mongo)
- [Sequelize-with-hot-flash](https://github.com/sahilrajput03/learning_sql/tree/main/sequealize-with-hot-flash)
- [mongoosejs-with-hot-flash](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/tree/master/mongoosejs-with-hot-flash)

Learn connectToDb is a necessary function i.e., if you only want to use the test runner on some tests that doesn't have any db connections needed you would need to use below `connectToDb` function:

```bash
connectToDb(async () => {})
```

## Usage

```bash
npm i flash-runner

# In package.json you can add scripts,

"scripts": {
	"test": "fr test1.test.js",
	"test:watch": "fr -w test1.test.js"
},

# -w is alias for --watch
```

Sample test:

```js
// file: test1.js
const {expect} = require('expect')

// necessary for now
connectToDb(async () => {})

const sum = (a, b) => {
	return a + b
}

test('one equals one', async () => {
	const received = sum(1, 2)
	const expected = 3

	expect(received).toBe(expected)
})
```

and you can run above test in watch mode via: `fr -w test1.js` or just run it once via: `fr test1.js`.

**Todo**:

- Implement `test.skip` functionality like jest.
