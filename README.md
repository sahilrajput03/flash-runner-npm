# Readme

Initialize this testing library to be used by other project via local link by

```bash
# run below command in current folder (only need to be done once for a lifetime in a system)
npm link

# now run below command in the project you want to use it
npm link flash
##fyi: I am using flash name coz its the package name i have for current npm project in package.json
## now in js files you can use it like:
require('flash')
```

**To see it in action, do**

```bash
degit sahilrajput03/learning-monogo-and-mongoosejs/mongoosejs-with-hot-flash
npm i
npm start
```
