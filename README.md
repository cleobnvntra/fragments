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

- starts the server via nodemon which restarts the server whenever there is a change in the src/\*\* folder.<br>
```sh
npm run dev
```

## debug script

- similar to dev, but attaches a debugger to a running process, which allows the use of the debugger on the server.<br>
```sh
npm run debug
```

> NOTE: dev and debug scripts uses the cross-env package to allow overriding of environment variable values when using Windows shells.<br><br>
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint --config .eslintrc.js src/**/*.js",
  "start": "node src/server.js",
  "dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src",
  "debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"
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
