POST http://localhost:8080/v1/fragments
# Send an unsupported type
Content-Type: some/type
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`Some unsupported content`

# expect to get an HTTP 415 for unsupported type
HTTP/1.1 415

[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" isString
