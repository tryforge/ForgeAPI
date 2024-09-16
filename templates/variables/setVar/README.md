# GetBotVariables

> this template sets a variable in your bot's database.

## Http request

```http
POST /variable/:name/:type/:value/:id?/:guildID? HTTP/1.1
Authorization: Bearer token
Content-Type: application/json
Content-Length: 0
Host: 127.0.0.1
```

| Name | description | examples | required |
|---|---|---|---|
| :name | The name of the variable| variable-a | true |
| :type | The variable type | user/guild/global/role/member/message/channel | true |
| :value | What the variable should be set to. | Example Value | true |
| :id | The string to get the variable from (not required for global variables) | 705306248538488947 | true |
| :guildid | guildID required for member, channel and role variables (guildVars use :id for the guildID) | 997899472610795580 | false |

## Example Http request

```http
POST /variable/test/uwu/testing4/ HTTP/1.1
Authorization: Bearer token
Content-Type: application/json
Content-Length: 0
Host: 127.0.0.1
```

## Result

```json
{
  "success": true
}
```
