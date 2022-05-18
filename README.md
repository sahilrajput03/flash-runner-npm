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

**Todo**:

- Implement `test.skip` functionality like jest.
