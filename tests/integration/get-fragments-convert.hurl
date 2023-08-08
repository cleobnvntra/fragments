# Create a new fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`**Test fragment**`

HTTP/1.1 201
Content-Type: text/markdown; charset=utf-8

# Capture location header
[Captures]
mdUrl: header "Location"

# Make a request to convert and retrieve the fragment
# Converts the fragment created based on the captured header into html
GET {{mdUrl}}.html
Content-Type: text/markdown; charset=utf-8
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/html; charset=utf-8

# Assert that the fragment has been converted to html
[Asserts]
body == "<p><strong>Test fragment</strong></p>\n"

# Capture the converted fragment
[Captures]
htmlUrl: header "Location"

# Make a request to convert and retrieve the fragment
# Converts the fragment converted to html from markdown, into txt
GET {{htmlUrl}}.txt
Content-Type: text/html; charset=utf-8
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8

# Assert that the fragment has been converted to txt
[Asserts]
body == "<p><strong>Test fragment</strong></p>\n"
