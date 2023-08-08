# Create a new text fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Text fragment`

HTTP/1.1 201
[Captures]
url: header "Location"

# Request to delete the fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Expect a 200 for deleting the fragment
HTTP/1.1 200

# Request to retrieve created fragment to check it doesn't exist
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Expect a 404 for unsuccessful request
HTTP/1.1 404
