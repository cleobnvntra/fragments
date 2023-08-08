# Create a new JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"name":"Cleo","age":28}`

HTTP/1.1 201
Content-Type: application/json; charset=utf-8
[Captures]
url: header "Location"

# Make a request to convert and retrieve a JSON fragment into an invalid type
GET {{url}}.invalidExt
Content-Type: application/json
[BasicAuth]
user1@email.com:password1

# Expect a 415 status for unsupported content-type
HTTP/1.1 415
