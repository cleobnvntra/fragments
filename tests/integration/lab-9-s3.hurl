# 1. Request to create a new fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# 2. Confirm the server returns 201 and capture the Location header
HTTP/1.1 201
[Captures]
url: header "Location"

# 3. Request to get the newly created fragment based on the captured url
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. Confirm the server returns 200, the Content-Type is text/plain
# and the body contains the string 'Hello S3!'
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

# 5. Request to delete the newly created fragment based on the captured url
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# 6. Confirm the server returns 200
HTTP/1.1 200

# 7. Try to request for the deleted fragment
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 8. Confirm the server returns 404 since the fragment does not exist
HTTP/1.1 404
