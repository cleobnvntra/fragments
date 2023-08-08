POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Greetings from DPS955`

HTTP/1.1 201
[Captures]
url: header "Location"

# Request to update the fragment
PUT {{url}}
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<h1>Greetings from DPS955</h1>`

# Expect a 400 for a type mismatch
# Updating a fragment to a different type is not allowed
HTTP/1.1 400

# Request to retrieve created fragment to check that it was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
# Expect content type to be text/plain
Content-Type: text/plain
[Asserts]
body == "Greetings from DPS955"
