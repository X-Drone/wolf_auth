# Wolf Auth API Documentation

## Auth Endpoints

### POST /auth/register
Регистрация нового пользователя

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "telegram": "@jdoe",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "telegram": "@jDoe",
  "created_at": "2025-11-13T10:30:00Z"
}
```

### POST /auth/login
Вход в систему

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## Users Endpoints

### GET /users/me
Получение информации текущего пользователя

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "telegram": "@jDoe",
  "created_at": "2025-11-13T10:30:00Z"
}
```

### GET /users/me/achievements
Получение достижений текущего пользователя

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "ach-001",
      "title": "First Friend",
      "description": "Добавить первого друга",
      "icon_url": "https://example.com/icon.jpg",
      "unlocked_at": "2025-11-13T11:20:00Z"
    },
    {
      "id": "ach-002",
      "title": "Social Butterfly",
      "description": "Добавить 10 друзей",
      "icon_url": "https://example.com/icon2.jpg",
      "unlocked_at": null
    }
  ],
  "total_unlocked": 1
}
```

### GET /users/{user_id}
Получение информации о пользователе по ID

**Response (200):**
```json
{
  "username": "jane_smith",
  "email": "jane@example.com",
  "telegram": "@jSmith",
  "created_at": "2025-10-01T08:15:00Z",
  "friends_count": 15,
  "is_friend": false
}
```

---

## Friends Endpoints

### GET /friends
Получение списка друзей текущего пользователя

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "friends": [
    {
      "username": "jane_smith",
      "avatar_url": "https://example.com/avatar2.jpg",
      "added_at": "2025-11-10T09:30:00Z"
    },
    {
      "username": "bob_wilson",
      "avatar_url": "https://example.com/avatar3.jpg",
      "added_at": "2025-11-05T14:20:00Z"
    }
  ],
  "total": 2
}
```

### POST /friends/requests
Отправка запроса на добавление в друзья

**Request:**
```json
{
  "recipient_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response (201):**
```json
{
  "request_id": "freq-123",
  "sender_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipient_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "pending",
  "created_at": "2025-11-13T16:00:00Z"
}
```

### POST /friends/requests/{request_id}/accept
Принятие запроса на добавление в друзья

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "status": "accepted",
  "friend": {
    "username": "john_doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "added_at": "2025-11-13T16:05:00Z"
  }
}
```

### POST /friends/requests/{request_id}/reject
Отклонение запроса на добавление в друзья

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "status": "rejected"
}
```

### DELETE /friends/{friend_id}
Удаление друга

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Friend removed successfully"
}
```

### GET /friends/suggestions
Получение рекомендаций для добавления в друзья

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "suggestions": [
    {
      "username": "alice_wonder",
      "avatar_url": "https://example.com/avatar4.jpg",
      "mutual_friends": 3,
      "reason": "mutual_friends"
    },
    {
      "username": "charlie_brown",
      "avatar_url": "https://example.com/avatar5.jpg",
      "mutual_friends": 1,
      "reason": "popular_user"
    }
  ],
  "total": 2
}
```

---

## Notifications Endpoints

### GET /notifications
Получение всех уведомлений

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip`: число (по умолчанию 0) - смещение
- `limit`: число (по умолчанию 20) - лимит

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "notif-001",
      "type": "friend_request",
      "title": "New Friend Request",
      "message": "john_doe sent you a friend request",
      "data": {
        "sender_id": "550e8400-e29b-41d4-a716-446655440000",
        "request_id": "freq-123"
      },
      "is_read": false,
      "created_at": "2025-11-13T16:00:00Z"
    },
    {
      "id": "notif-002",
      "type": "achievement_unlocked",
      "title": "Achievement Unlocked",
      "message": "You unlocked the achievement: First Friend",
      "data": {
        "achievement_id": "ach-001"
      },
      "is_read": true,
      "created_at": "2025-11-13T15:00:00Z"
    }
  ],
  "total": 2
}
```

### GET /notifications/{id}
Получение уведомления по ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": "notif-001",
  "type": "friend_request",
  "title": "New Friend Request",
  "message": "john_doe sent you a friend request",
  "data": {
    "sender_id": "550e8400-e29b-41d4-a716-446655440000",
    "request_id": "freq-123"
  },
  "is_read": false,
  "created_at": "2025-11-13T16:00:00Z"
}
```

### DELETE /notifications/{id}
Удаление уведомления

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "message": "Notification deleted successfully"
}
```

### POST /notifications/mark_read
Отметить уведомления как прочитанные

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "notification_ids": ["notif-001", "notif-002"]
}
```

**Response (200):**
```json
{
  "marked_count": 2,
  "message": "Notifications marked as read"
}
```

### GET /notifications/unread_count
Получение количества непрочитанных уведомлений

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "unread_count": 3
}
```

---

## Achievements Endpoints

### GET /achievements
Получение всех достижений в системе

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "ach-001",
      "title": "First Friend",
      "description": "Добавить первого друга",
      "icon_url": "https://example.com/icon.jpg",
      "rarity": "common"
    },
    {
      "id": "ach-002",
      "title": "Social Butterfly",
      "description": "Добавить 10 друзей",
      "icon_url": "https://example.com/icon2.jpg",
      "rarity": "rare"
    },
    {
      "id": "ach-003",
      "title": "Night Owl",
      "description": "Активен после полуночи",
      "icon_url": "https://example.com/icon3.jpg",
      "rarity": "epic"
    }
  ],
  "total": 3
}
```

### POST /achievements/trigger
Проверка и активирование достижений для пользователя

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "trigger_type": "friend_added"
}
```

**Response (200):**
```json
{
  "unlocked_achievements": [
    {
      "id": "ach-001",
      "title": "First Friend",
      "message": "Congratulations! You unlocked: First Friend"
    }
  ],
  "total_unlocked": 1
}
```

---

## Error Responses

Все ошибки возвращаются в следующем формате:

### 400 Bad Request
```json
{
  "detail": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "detail": "User not found"
}
```

### 409 Conflict
```json
{
  "detail": "User with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```