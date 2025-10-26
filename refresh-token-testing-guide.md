# Refresh Token Testing Guide for Postman

## Overview

This guide shows how to test the refresh token implementation using Postman. The flow involves: Register → Verify Email → Login → Use Refresh Token.

## Prerequisites

- Postman installed
- Backend server running (usually `npm run start:dev`)
- Environment variables set (JWT_SECRET, JWT_REFRESH_SECRET, etc.)

## Testing Flow

### 1. Register a New User

**Endpoint:** `POST /auth/sign-up`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Success"
}
```

### 2. Verify Email (Get Initial Tokens)

**Endpoint:** `POST /auth/verify-email`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "john.doe@example.com",
  "token": "852000"
}
```

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** Check the **Cookies** tab in Postman response. You should see:

- Cookie name: `refreshToken`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- HttpOnly: true
- Secure: true
- SameSite: strict

### 3. Login (Get Tokens)

**Endpoint:** `POST /auth/login`

**Headers:**

```
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Important:** Check the **Cookies** tab again for the refresh token cookie.

### 4. Test Protected Route (Optional)

**Endpoint:** `POST /auth/auth-test`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
Content-Type: application/json
```

**Expected Response:**

```json
{
  "id": "user-uuid-here",
  "email": "john.doe@example.com"
}
```

### 5. Refresh Token (Main Test)

**Endpoint:** `POST /auth/refresh-token`

**Headers:**

```
Content-Type: application/json
```

**Body:** Empty (no body needed)

**Important:** Make sure the refresh token cookie from step 2 or 3 is still present in Postman's cookie jar.

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Check:** The response should include a new refresh token cookie.

## Postman Setup Tips

### 1. Enable Cookie Management

- Go to **Settings** → **General** → Enable **"Send cookies"**
- Or manually manage cookies in the **Cookies** tab

### 2. Environment Variables (Optional)

Create a Postman environment with:

```
base_url: http://localhost:3000
access_token: {{access_token}}
```

### 3. Cookie Testing Steps

1. After login/verify-email, check **Cookies** tab in response
2. Copy the `refreshToken` cookie value
3. For refresh-token request, ensure cookie is sent automatically
4. If not automatic, manually add cookie in **Headers** tab:
   ```
   Cookie: refreshToken=your_refresh_token_here
   ```

## Testing Scenarios

### ✅ Success Cases

1. **Valid refresh token** → Returns new access token + new refresh token cookie
2. **Multiple refreshes** → Each call should work and rotate tokens
3. **Protected route access** → Use new access token to access protected endpoints

### ❌ Error Cases

1. **No refresh token cookie** → Should return 401 Unauthorized
2. **Invalid refresh token** → Should return 403 Forbidden
3. **Expired refresh token** → Should return 403 Forbidden
4. **Missing user** → Should return 403 Forbidden

## Troubleshooting

### Common Issues

1. **"Access denied" error:**
   - Check if user exists in database
   - Verify `hashedRt` field is not null

2. **Cookie not being sent:**
   - Enable cookie management in Postman settings
   - Check if cookie domain/path matches your server
   - Try manually adding cookie in headers

3. **"Invalid refresh token" error:**
   - Ensure you're using the latest refresh token cookie
   - Check if token was already used (tokens rotate on each refresh)

4. **CORS issues:**
   - Make sure your server allows cookies from Postman
   - Check CORS configuration in your NestJS app

### Debug Steps

1. Check server logs for detailed error messages
2. Verify database has correct user data with `hashedRt`
3. Test with curl if Postman has issues:
   ```bash
   curl -X POST http://localhost:3000/auth/refresh-token \
        -H "Content-Type: application/json" \
        -H "Cookie: refreshToken=your_token_here"
   ```

## Expected Database State

After successful operations, check your `users` table:

- User should have `status = 'active'`
- User should have `hashedRt` field populated (hashed refresh token)
- `token` field should be null after email verification
