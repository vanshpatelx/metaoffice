# API Endpoints

## Auth
- **SignUp**  
  `POST /api/v1/signup`

- **Login**  
  `POST /api/v1/signin`

---

## Space
- **Create a Space**  
  `POST /api/v1/space`

- **Delete a Space**  
  `DELETE /api/v1/space/:spaceId`

- **Get My Existing Spaces**  
  `GET /api/v1/space/all`

- **Get a Space**  
  `GET /api/v1/space/:spaceId`

---

## Arena
- **Add an Element**  
  `POST /api/v1/space/element`

- **Delete an Element**  
  `DELETE /api/v1/space/element`

- **See All Available Elements**  
  `GET /api/v1/elements`

---

## Admin
- **Create an Element**  
  `POST /api/v1/admin/element`

- **Update an Element**  
  `PUT /api/v1/admin/element/:elementId`

- **Create an Avatar**  
  `POST /api/v1/admin/avatar`

- **Create a Map**  
  `POST /api/v1/admin/map`
