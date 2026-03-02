# Backend structure Overview

# 🔐Api Routes

## Authentication 
**Base Path:** `/api/v1/auth`  
Handles user onboarding and secure session management.

| Endpoint    | Method | Description                                             |
|:------------|:-------|:--------------------------------------------------------|
| `/register` | `POST` | Creates a new user account with provided credentials.   |
| `/login`    | `POST` | Authenticates a user and returns a secure access token. |

##  🧘Posture Events
**Base Path:** `/api/v1/posture`  
Tracks and manages physical posture data points.


| Endpoint  | Method | Description                                                   |
|:----------|:-------|:--------------------------------------------------------------|
| `/events` | `GET`  | Retrieves a historical list of all posture data for the user. |
| `/events` | `POST` | Records a new posture event to the database.                  |
### 👤User Management
**Base Path:** `/api/v1/users`  
Manages profile details and account status.

| Endpoint | Method   | Description                                              |
|:---------|:---------|:---------------------------------------------------------|
| `/me`    | `DELETE` | Permanently removes the current user's profile and data. |

###   ⚙️Settings 
**Base Path:** `/api/v1/settings`  
Manages user preferences and application configurations.

| Endpoint | Method | Description                                                 |
|:---------|:-------|:------------------------------------------------------------|
| `/`      | `GET`  | Fetches the current user’s custom settings and preferences. |
| `/`      | `PUT`  | Updates existing settings with new configuration data.      |

###   Analytics
**Base Path:** `/api/v1/analytics`  
Manages posture events analytics

| Endpoint  | Method | Description                                            |
|:----------|:-------|:-------------------------------------------------------|
| `/weekly` | `GET`  | Fetches the current user’s weekly analytics.           |
| `/today`  | `GET`  | Fetches the current user’s  analytics for current day. |



-----
## Requests and Responses
## Auth

### POST /api/v1/auth/register
Request Body: 
```json
{
"username":"TestUser",
"email":"Test@example.com",
"password":"test123"
}
```

### POST /api/v1/auth/login
Request Body:
```json
{
"username":"TestUser",
"password":"test123"
}
```

## Posture Events 
### POST /api/v1/posture/events
Request Body:
```json
{
  "postureState":"slouched",
  "confidence": "0.95",
  "severity": "0.5",
  "timestamp" : "2026-03-02T11:20:00Z"
}

```

###  GET /api/v1/posture/events

### Query Parameters:
| Parameter | Type     | Required | Description                      |
|:----------|:---------|:---------|:---------------------------------|
| start     | ISO-8601 | Yes      | The beginning of the time range. |
| end       | ISO-8601 | Yes      | The end of the time range.       |


### Example Request:
GET /api/v1/posture/events?start=2026-03-01T08:00:00&end=2026-03-01T20:00:00

###  Example Response

```json
[
  {
    "id": 101,
    "postureState": "GOOD",
    "confidence": 0.99,
    "severity": 0.1,
    "timestamp": "2026-03-01T08:30:00"
  }
]
```

## Users Management

### DELETE /api/v1/users/me
Permanently deletes the authenticated user's profile and all associated data from the system.
 Authentication: Required (Bearer Token). The user identity is determined by the secure token provided in the header.

## Success Response
| StatusCode       | Description                             | 
|:-----------------|:----------------------------------------|
| 204 No-content   | The account was successfully deleted    |   
| 401 Unauthorized | Invalid or missing authentication token |  










