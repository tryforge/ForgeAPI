# GetBotVariables

> this template gets the whole json of a variable from your discord bot.

## Http request

```http
GET /variable/fetch/:name/:type/:id HTTP/1.1
Authorization: Bearer token
Host: 127.0.0.1
```

| Name | description | examples | required |
|---|---|---|---|
| :name | The name of the variable| variable-a | true |
| :type | The variable type | user/guild/global/role/member | true |
| :id | The string to get the variable from (not required for global variables) | 705306248538488947 | true |
| :guildid | guildID required for member, channel and role variables | 997899472610795580 | false |

## Example Http request

```http
GET /variable/fetch/blush-give/user/705306248538488947 HTTP/1.1
Authorization: Bearer token
Host: 127.0.0.1
```

## Result

```json
{
  "result":{
    "identifier":"user_blush-give_705306248538488947",
    "name":"blush-give",
    "id":"705306248538488947",
    "type":"user",
    "value":"1",
    "guildId":null
  }
}
```
