# For author only

**---update this readme----**

Initialize this testing library to be used by other project via local link by

```bash
# Clone this repo and run below command in current folder (only need to be done once for a lifetime in a system)
npm link

# Now run below command in any of your project you want to use it with:
npm link flash
## Fyi: I am using flash name coz its the package name i have for current npm project in package.json
## Now in js files you can use it like:
require('flash')
```

**TLDR; To see it in action, do**

```bash
mkdir flash; cd flash
degit sahilrajput03/flash
npm link
cd ..

mkdir mongoosejs-with-hot-flash; cd mongoosejs-with-hot-flash
degit sahilrajput03/learning-monogo-and-mongoosejs/mongoosejs-with-hot-flash
npm i
npm link flash
npm start
```
