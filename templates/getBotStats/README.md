# GetBotStats

> this template shows main bot stats

## Http request

```http
GET /botstats HTTP/1.1
Authorization: Bearer token
Host: 127.0.0.1
```

## Result

```json
{
  "client": {
    "name": "Akira",
    "id": 738057910923296839,
    "ping": 145,
    "uptime": "3406ms"
  },
  "guildCount": 8,
  "userCount": 153,
  "commandCount": 40
}
```
