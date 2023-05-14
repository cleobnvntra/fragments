# fragments

An API Server that is a node.js based REST API using Express

# Scripts

## lint script

- npm run lint<br>
> runs eslint on the src directory to check for errors or potential bugs in codes.

## start script

- npm start<br>
> starts the server normally.

## dev script

- npm run dev<br>
> starts the server via nodemon which restarts the server whenever there is a change in the src/\*\* folder.

## debug script

- npm run debug<br>
> similar to dev, but attaches a debugger to a running process, which allows the use of the debugger on the server.

> NOTE: dev and debug scripts uses the cross-env package to allow overriding of environment variable values when using Windows shells.<br><br>
"scripts": {<br>
&emsp;"test": "echo \"Error: no test specified\" && exit 1",<br>
&emsp;"lint": "eslint --config .eslintrc.js src/\*_/_.js",<br>
&emsp;"start": "node src/server.js",<br>
&emsp;"dev": "cross-env LOG_LEVEL=debug nodemon ./src/server.js --watch src",<br>
&emsp;"debug": "cross-env LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"<br>
}

# Dependencies
## cors
- npm install --save express cors
> allows a server to specify origins that are allowed to access its resources.<br>

## helmet
- npm install --save express helmet
> security middleware functions for Express.js apps.

## compression
- npm install --save express compression
> provides middleware for Express.js apps to compress HTTP responses.

## pino
- npm install --save pino
> a logging tool that provides a more detailed description of logs, which can also be personalized through options.
