# Backapp API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:3000/api` (development) or your production URL  
**Swagger UI:** `http://localhost:3000/api/docs`

---

## Table of Contents

- [Authentication](#authentication)
- [Auth Endpoints](#auth-endpoints)
- [User Endpoints](#user-endpoints)
- [Order Endpoints](#order-endpoints)
- [Partner Endpoints](#partner-endpoints)
- [Health Check](#health-check)

---

## Authentication

All authenticated endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

To obtain a token, use the **Login** endpoint under Auth Endpoints.

---

## Auth Endpoints

### POST `/auth/login`

Authenticate and receive a JWT access token.

| Parameter  | Type   | Required | Description                     |
|------------|--------|----------|---------------------------------|
| `email`    | string | Yes      | User's email address            |
| `password` | string | Yes      | User's password                 |

**Success Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "user",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Description                     |
|--------|---------------------------------|
| 400    | Invalid credentials (bad body)  |
| 404    | User not found                  |
| 401    | Invalid credentials             |

---

### GET `/auth/profile`

Get current authenticated user's profile. Requires JWT token.

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "user"
}
```

---

### POST `/auth/forgot-password`

Request a password reset code to be sent via email.

| Parameter  | Type   | Required | Description             |
|------------|--------|----------|-------------------------|
| `email`    | string | Yes      | User's email address    |

**Success Response (201):**

```json
{
  "forgotPasswordData": "Email sent successfully"
}
```

---

### PATCH `/auth/reset-password`

Reset password using the confirmation code sent via email.

| Parameter          | Type   | Required | Description                                    |
|--------------------|--------|----------|------------------------------------------------|
| `email`            | string | Yes      | User's email address                           |
| `confirmationCode` | string | Yes      | Code received via email                        |
| `newPassword`      | string | Yes      | New password (min 8 chars, max 18)             |
| `confirmPassword`  | string | Yes      | Must match newPassword                         |

**Password Requirements:**
- Minimum 8 characters, maximum 18 characters
- Contains at least one lowercase letter
- Contains at least one uppercase letter
- Contains at least one digit
- Contains at least one special character (no spaces)
- Only Latin letters allowed in the password

**Success Response (200):**

```json
{
  "message": "Password has been reset successfully"
}
```

---

### GET `/auth/all-codes`

Retrieve all confirmation codes. **Admin only.** Requires JWT token.

**Success Response (200):**

```json
[
  {
    "code": "123456",
    "email": "user@example.com",
    "status": "pending"
  }
]
```

---

## User Endpoints

### GET `/user`

Get all users. **Admin only.** Requires JWT token.

**Success Response (200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "password": "$2b$10$...",
    "role": "user"
  }
]
```

---

### GET `/user/:id`

Get a specific user by ID. Requires JWT token.

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "password": "$2b$10$...",
  "role": "user"
}
```

---

### POST `/user`

Create a new user.

| Parameter  | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| `email`    | string | Yes      | User's email address (Latin letters only)       |
| `password` | string | Yes      | New password (see password requirements above)  |

**Success Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newuser@example.com",
  "password": "$2b$10$...",
  "role": "user"
}
```

---

### PATCH `/user/:id`

Update a specific user. Requires JWT token.

| Parameter  | Type   | Required | Description                                    |
|------------|--------|----------|------------------------------------------------|
| `email`    | string | No       | User's email address (Latin letters only)       |
| `password` | string | No       | New password (see password requirements above)  |

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "password": "$2b$10$...",
  "role": "user"
}
```

---

### DELETE `/user/:id`

Delete a specific user. Requires JWT token.

**Success Response (200):**

```json
null
```

---

## Order Endpoints

### POST `/orders`

Create a new order.

| Parameter  | Type   | Required | Description                                             |
|------------|--------|----------|---------------------------------------------------------|
| `customerName` | string | Yes      | Customer name (5-100 chars, letters/numbers/spaces)     |
| `email`    | string | No       | Optional customer email                                 |
| `customFields` | any  | No       | Additional custom data                                  |
| `address`  | object | No       | Optional address object                                 |

**Address Object (Optional):**

| Parameter      | Type   | Required | Description                                        |
|----------------|--------|----------|-----------------------------------------------------|
| `buildingType` | string | No       | Building type (apartment, house, etc.)              |
| `houseNumber`  | string | No       | House number                                        |
| `apartmentNumber` | string | No      | Apartment number                                    |
| `street`       | string | No       | Street name                                         |
| `city`         | string | No       | City name                                           |
| `zipCode`      | string | No       | ZIP/postal code                                     |
| `state`        | string | No       | State/region                                        |

**Success Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Elon Musk",
  "email": "elon@example.com",
  "customFields": {},
  "address": null,
  "status": "pending",
  "orderNumber": "ORD-202601251234-5678"
}
```

---

### GET `/orders`

Get all orders.

**Success Response (200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerName": "Elon Musk",
    "status": "pending"
  }
]
```

---

### GET `/orders/by-email?email=example.com`

Get all orders for a specific email address.

| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `email`   | string | Yes      | Email address to search by |

**Success Response (200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customerName": "Elon Musk",
    "status": "pending"
  }
]
```

---

### GET `/orders/by-ordernumber?orderNumber=ORD-202601251234-5678`

Get a specific order by its order number.

| Parameter     | Type   | Required | Description              |
|---------------|--------|----------|--------------------------|
| `orderNumber` | string | Yes      | The order's unique number |

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Elon Musk",
  "orderNumber": "ORD-202601251234-5678"
}
```

---

### GET `/orders/:id`

Get a specific order by its ID.

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `id`      | string | Yes      | UUID of the order        |

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Elon Musk"
}
```

---

### PATCH `/orders/:id`

Update an order. Requires JWT token.

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Updated Name"
}
```

---

### PATCH `/orders/:id/status`

Update order status. **Admin only.** Requires JWT token.

| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `orderNumber` | string | Yes      | The order's unique number |
| `orderStatus` | string | Yes      | New status value         |

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderNumber": "ORD-202601251234-5678",
  "status": "in-progress"
}
```

---

### PATCH `/orders/:id/assign`

Update order assignee. **Admin only.** Requires JWT token.

| Parameter | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| `orderNumber` | string | Yes      | The order's unique number     |
| `assignedTo` | string | Yes      | Assigned technician/user name |

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "assignedTo": "John Doe"
}
```

---

### DELETE `/orders/:id`

Delete an order. Requires JWT token.

**Success Response (200):**

```json
{
  "message": "Order deleted successfully"
}
```

---

## Partner Endpoints

> **Note:** All partner endpoints require JWT token and admin role.

### POST `/partners`

Create a new partner.

| Parameter  | Type   | Required | Description                                        |
|------------|--------|----------|----------------------------------------------------|
| `partnerName` | string | Yes      | Partner name (5-50 chars, Latin letters only)      |
| `email`    | string | Yes      | Partner email (Latin letters only)                 |
| `customFields` | any  | No       | Additional custom data                              |

**Success Response (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "partnerName": "All Stars LLC",
  "email": "allstars@example.com",
  "customFields": {}
}
```

---

### GET `/partners`

Get all partners. **Admin only.**

**Success Response (200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "partnerName": "All Stars LLC",
    "email": "allstars@example.com"
  }
]
```

---

### GET `/partners/:id`

Get a specific partner by ID. **Admin only.**

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "partnerName": "All Stars LLC"
}
```

---

### PATCH `/partners/:id`

Update a partner. **Admin only.**

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "partnerName": "Updated Name"
}
```

---

### PATCH `/partners/:id/status`

Update partner status. **Admin only.**

**Success Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "authSecretStatus": "active"
}
```

---

### DELETE `/partners/:id`

Delete a partner. **Admin only.**

**Success Response (200):**

```json
{
  "message": "Partner deleted successfully"
}
```

---

## Health Check

### GET `/health`

Check if the service is running.

**Success Response (200):**

```json
{
  "message": "Hello world"
}
```

---

## API Status Codes

| Code | Description                          |
|------|--------------------------------------|
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request (invalid input)          |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found                            |

---

## Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Invalid credentials",
  "description": "The provided credentials are incorrect"
}
```

---

**Generated:** 2026-01-25  
**Project:** Backapp CRM Backend
