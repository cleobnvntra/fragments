# Unauthenticated POST request
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
someuser@gmail.com:password10
`Unauthenticated fragment`

HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" isString
