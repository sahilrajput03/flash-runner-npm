# Readme

Learn connectToDb is a necessary function i.e., if you only want to use the test runner on some tests that doesn't have any db connections needed you would need to use below `connectToDb` function:

```bash
connectToDb(async () => {})
```

## Usage

```bash
npm i flash-runner

# In package.json you can add scripts,

"scripts": {
	"test": "fr code.js",
	"test:watch": "fr -w code.js"
},

# -w is alias for --watch
```

Sample test:

```js
// file: test1.js
const {expect} = require('expect')

connectToDb(async () => {})

test('one equals one', async () => {
	expect(1).toBe(1)
})
```

and you can run above test in watch mode via: `fr -w test1.js` or just run it once via: `fr test1.js`.

**Todo**:

- Implement `test.skip` functionality like jest.
