# Readme

Test runner that caches your database connection or any of your expensive computation between tests runs.

**Other notes:**

- FYI: Always use `express-async-errors` while testing a express app coz it will helps directly to `flash-runner` and standalone `server` running in prevention of crashing (in case of some error thrown). This is helpful in `flash-runner` as the server doesn't crash on failure/exception thrown by one route and thus watching service keeps running as well. Yikes! `Flash-runner`+`express-async-errors` rocks!

**Implementation (with hot):**

- testing-hot-flash-express-sequelize -> [fso-part13](https://github.com/sahilrajput03/learning_sql/tree/main/fso-part13/exercise-13.4-blogs)
- [testing-hot-flash-express-mongo](https://github.com/sahilrajput03/learn-express/tree/main/testing-hot-flash-express-mongo)
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

test('sum function', async () => {
	const received = sum(1, 2)
	const expected = 3

	expect(received).toBe(expected)
})
```

and you can run above test in watch mode via: `fr -w test1.js` or just run it once via: `fr test1.js`.

## Commonly used assertions

```bash
// All below expectation will be PASSED
expect(10).toBe(10)
expect({name: 'dan', age: '22'}).toHaveProperty('name')
expect({name: 'roy', age: 10}).toMatchObject({name: 'roy'})
expect([1,21,31]).toContain(1, 21)
```

**Implementation (with hot):**

- redis db_testing: https://github.com/sahilrajput03/LearningRedis
- testing-hot-flash-express-sequelize -> [fso-part13](https://github.com/sahilrajput03/learning_sql/tree/main/fso-part13/exercise-13.4-blogs)
- [testing-hot-flash-express-mongo](https://github.com/sahilrajput03/learn-express/tree/main/testing-hot-flash-express-mongo)
- [Sequelize-with-hot-flash](https://github.com/sahilrajput03/learning_sql/tree/main/sequealize-with-hot-flash)
- [mongoosejs-with-hot-flash](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/tree/master/mongoosejs-with-hot-flash)

Learn connectToDb is a necessary function i.e., if you only want to use the test runner on some tests that doesn't have any db connections needed you would need to use below `connectToDb` function:

```bash
connectToDb(async () => {})
```

## Todo

- Implement `test.skip` functionality like jest.
