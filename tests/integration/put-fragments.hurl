# Create a new fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<h3>Some html data</h3>`

HTTP/1.1 201
[Captures]
url1: header "Location"

# Request to update the fragment
PUT {{url1}}
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<h1>Updated html data</h1>`

# Expect 200 for successful update
HTTP/1.1 200
Content-Type: text/html; charset=utf-8
[Captures]
url2: header "Location"

# Request to retrieve the fragment to check its updated raw data
GET {{url2}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<h1>Updated html data</h1>"
