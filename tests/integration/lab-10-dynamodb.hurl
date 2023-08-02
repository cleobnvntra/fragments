# 1. Request to create new JSON fragment
POST http://localhost:8080/v1/fragments
Content-Type: application/json; charset=utf-8
[BasicAuth]
user1@email.com:password1
`{ "service": "DynamoDB" }`

# 2. Confirm a 201 response and capture Location header and fragment id
HTTP/1.1 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. Retrieve the fragment metadata using captured location, and confirm 201 response
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.type" == "application/json; charset=utf-8"

# 4. Create a new Markdown fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**`

# 5. Confirm a 201 response and capture Location header and fragment id
HTTP/1.1 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6. Retrieve the fragment metadata
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragments.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragments.created" isString
jsonpath "$.fragments.updated" isString
jsonpath "$.fragments.size" == 21
jsonpath "$.fragments.type" == "text/markdown"

# 7. Retrieve all fragment ids, and confirm the two fragments created are the same from the retrieved ids
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" isCollection
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"

# 8. Delete the first created fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 9. Confirm a 200 response
HTTP/1.1 200

# 10. Request to retrieve the deleted id
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 11. Confirm a 404 response since the fragment shouldnt exist anymore
HTTP/1.1 404

# 12. Retrieve all fragments and confirm the first fragment is deleted and second fragment still exist
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"
