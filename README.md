# Readme

Test runner that caches your database connection or any of your expensive computation between tests runs.

Since you can use jest's expect library, i.e, [expect](https://www.npmjs.com/package/expect). The tests remains same and should work with a little change of `connectToDb` function fix for the database connection.

## Motivation

Jest's test runner has no capability to share values and module between tests suites in watch mode. Issue [closed here](https://github.com/facebook/jest/issues/6800). But it seems that work is going on this [issue here](https://github.com/facebook/jest/issues/7184).

## Usage

### Cli

```bash
# Installation
npm i flash-runner

# Add below scripts to `package.json` and utilise those script
"scripts": {
	"test": "fr test1.test.js",
	"test-watch": "fr -w test1.test.js"
},
# -w is alias for --watch
```

### Sample test:

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

NOTE:  `connectToDb` is intended to make a cache of database connection as you can see the way I have used in many reference projects section. Since it is a necessary function so just write an empty function like above even in case you don't want to have a db connection either.

**Running tests:**
- watch mode: `npm test-watch`
- run it once (for ci-cd build test pipeline): `npm test`

### Reference projects that use `flash-runner`

- Full Project Example: [fso-part13](https://github.com/sahilrajput03/learning_sql/tree/main/fso-part13)
- [express-mongo-with-flash-runner](https://github.com/sahilrajput03/learn-express/tree/main/express-mongo-with-flash-runner)
- [sequelize-with-flash-runner](https://github.com/sahilrajput03/learning_sql/tree/main/sequelize-with-flash-runner)
- [mongoosejs-with-flash-runner](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/tree/master/mongoosejs-with-flash-runner)
- [LearningRedis](https://github.com/sahilrajput03/LearningRedis)

### Beginners with testing? Some commonly used assertions

```js
// All below expectation will be PASSED
expect(10).toBe(10)
expect({name: 'dan', age: '22'}).toHaveProperty('name')
expect({name: 'roy', age: 10}).toMatchObject({name: 'roy'})
expect([1,21,31]).toContain(1, 21)
```

## Other notes:

- FYI: Always use `express-async-errors` while testing a express app coz it will helps directly to `flash-runner` and standalone `server` running in prevention of crashing (in case of some error thrown). This is helpful in `flash-runner` as the server doesn't crash on failure/exception thrown by one route and thus watching service keeps running as well. Yikes! `Flash-runner`+`express-async-errors` rocks!

**Todo**

- Implement `test.skip` functionality like jest.
