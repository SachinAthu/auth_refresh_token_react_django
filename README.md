## React and Django JWT authentication demo

### used djangorestframework-simplejwt for JWT

- login using token
- logout
- use react context API to store the token info and access from throughout the app
- store token in localstorage
- reload the token using refresh token
- protect routes

#### frontend1 - periodically checks the token and update it using the refresh token. In this method, we must know the token timeout(lifetime) that configured from the backend.

#### frontend2 - use axios interceptors to check token and refresh token
 