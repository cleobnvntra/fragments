# Fragments server API routes

# 1. GET routes
## GET /fragments
- GET route for /v1/fragments and /v1/fragments/?expand=1
```
/v1/fragments responds with a list of fragments.

/v1/fragments?expand=1 responds with a list of metadata of fragments.

returns an empty list if no fragments were found.
```

## GET /fragments/:id
- GET route for /v1/fragments/:id and /v1/fragments/:id.ext
```
/v1/fragments/:id responds with the raw data of the fragment requested based on the id parameter.

/v1/fragments/:id.ext converts the requested fragment into the requested type based on the extension and send it as response.
```

### Valid fragment conversions
| Type               | Valid Conversion Extensions     |
| ------------------ | ------------------------------- |
| `text/plain`       | `.txt`                          |
| `text/markdown`    | `.md`, `.html`, `.txt`          |
| `text/html`        | `.html`, `.txt`                 |
| `application/json` | `.json`, `.txt`                 |
| `image/png`        | `.png`, `.jpeg`, `.webp`, `.gif`|
| `image/jpeg`       | `.png`, `.jpeg`, `.webp`, `.gif`|
| `image/webp`       | `.png`, `.jpeg`, `.webp`, `.gif`|
| `image/gif`        | `.png`, `.jpeg`, `.webp`, `.gif`|

## GET /fragments/:id/info
- GET route for /v1/fragments/:id/info
```
responds with the metadata of the requested fragment based on the id parameter.
```
<br>

# 2. PUT route
## PUT /fragments/:id
- PUT route for /v1/fragments/:id
```
updates the requested fragment based on the id parameter.

RESTRICTIONS:
- A user is not allowed to update the existing fragment to a different type.
```
<br>

# 3. POST route
## POST /fragments
- POST route for /v1/fragments
```
creates a fragment. A fragment id is generated using crypto UUID.

The fragment data is saved on an S3 bucket, and its metadata saved to DynamoDB.
```

# 4. DELETE route
## DELETE /fragments/:id
- DELETE route for /v1/fragments/:id
```
deletes the requested fragment based on the id parameter.

The fragment's data is deleted from the S3 bucket, and the metadata deleted from DynamoDB.
```
