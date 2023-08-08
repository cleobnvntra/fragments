# Create a new text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Text fragment`

HTTP/1.1 201
[Captures]
url: header "Location"

# Request to delete a non-existing fragment
DELETE http://localhost:8080/v1/fragments/someInvalidId
[BasicAuth]
user1@email.com:password1

# Expect a 404 for deleting a non-existing fragment
HTTP/1.1 404

# Request to retrieve created fragment to check it still exists
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Expect a 200
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Text fragment"
