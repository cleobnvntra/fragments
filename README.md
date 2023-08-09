# fragments

An API Server that is a node.js based REST API using Express

# Scripts

## lint script

- npm run lint

```sh
runs eslint on the src directory to check for errors or potential bugs in codes.
```

## start script

- npm start<br>
```sh
starts the server normally.
```

## dev script

- starts the server via nodemon which restarts the server whenever there is a change in the src/** folder.<br>
```sh
npm run dev
```

## debug script

- similar to dev, but attaches a debugger to a running process, which allows the use of the debugger on the server.<br>
```sh
npm run debug
```

## test script

-run all tests using jest.config.js configuration one by one. 
```sh
npm test
npm test <partial or full filename> - runs specified tests only
```

## test:watch script

-similar to test script, but testing won't stop. Instead, it will keep watch for any changes made in the file, and automatically re-runs the test whenever changes are saved.
```sh
npm run test:watch
npm run test:watch <partial or full filename> - runs specified tests only
```

## coverage script

-runs a test and collects test coverage information such as: files and lines of code being tested.
```sh
npm run coverage
npm run coverage <partial or full filename> - displays coverage of specified tests only
```

## integration tests script

-runs integration tests for deployment
```sh
npm run test:integration
```

> NOTE: dev and debug scripts uses the cross-env package to allow overriding of environment variable values when using Windows shells.<br><br>
```json
"scripts": {
    "test:integration": "hurl --test --glob \"tests/integration/**/*.hurl\"",
    "test:watch": "jest -c jest.config.js --runInBand --watch --",
    "test": "jest -c jest.config.js --runInBand --detectOpenHandles --",
    "coverage": "jest -c jest.config.js --runInBand --coverage",
    "lint": "eslint --config .eslintrc.js \"./src/**/*.js\" \"tests/**/*.js\"",
    "start": "nodemon src/index.js",
    "dev": "cross-env LOG_LEVEL=debug nodemon ./src/index.js --watch src | pino-pretty",
    "debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/index.js --watch src"
  }
```
# Dependencies
## cors
- allows a server to specify origins that are allowed to access its resources.<br>
```sh
npm install --save express cors
```

## helmet
- security middleware functions for Express.js apps.<br>
```sh
npm install --save express helmet
```

## compression
- provides middleware for Express.js apps to compress HTTP responses.<br>
```sh
npm install --save express compression
```

## pino
- a logging tool that provides a more detailed description of logs, which can also be personalized through options.<br>
```sh
npm install --save pino
```

## sharp
- an image processing tool which is used for converting images for this service
```sh
npm install sharp
```

## markdown-it
- a library which is used for converting markdown texts into html texts
```sh
npm install markdown-it --save
```

# Dev Dependencies

## jest
- a testing framework which simplifies and automates the process of testing code.
```sh
npm install --save-dev jest
```

## supertest
-a library that simplifies HTTP request testing for Node.js applications.
```sh
npm install --save-dev supertest
```
