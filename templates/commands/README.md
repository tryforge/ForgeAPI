# GetBotStats

> this template shows a list of all commands your bot has.

## Http request

```http
GET /commands HTTP/1.1
Authorization: Bearer token
Host: 127.0.0.1
```

## Result

```json
{
  "messageCommands": {
    "list": [
      {
        "name": "test",
        "aliases": [ "exampleCommand", "lookatme" ],
        "type": "messageCreate",
        "code": "$title[This is an test] $color[#ff47ff] $description[Im here to act as an example for this json.]",
        "path": "/home/lynnux/GitHub/Akira-Beta/dist/commands/dev/test.js",
        "unloadable": true
      }
        ],
    "paths": "dist/commands",
    "amount": "1"
  },
  "interactons": {
    "list": [
      {
        "type": "interactionCreate",
        "code": "$logger[Info;This is an interaction, this includes / commands and other interactions like buttons/modals etc]",
        "path": "/home/lynnux/GitHub/Akira-Beta/dist/commands/Global-Interactions/triggers/onInteractionCreate.js",
        "unloadable": true
      },
    ],
    "paths": "dist/slash",
    "amount": "1"
  },
  "other": {
    "list": [
      {
        "name": "onReady",
        "type": "ready",
        "code": "$logger[Info;These are other commands like ready, error etc]",
        "path": "/home/lynnux/GitHub/Akira-Beta/dist/commands/Global-Interactions/triggers/onReady.js",
        "unloadable": true
      },
    ],
    "amount": "1"
  }
}
```
