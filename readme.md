# botbuilder-timeout

[![npm](https://img.shields.io/badge/botbuilder--timeout-pass-green.svg)](https://github.com/user1m/botbuilder-timeout/)
[![license](http://img.shields.io/npm/l/jasmine-console-reporter.svg)](https://github.com/onury/jasmine-console-reporter/blob/master/LICENSE)
[![downloads](http://img.shields.io/npm/dm/jasmine-console-reporter.svg)](https://www.npmjs.com/package/jasmine-console-reporter)
[![dependencies Status](https://david-dm.org/user1m/botbuilder-timeout/status.svg)](https://david-dm.org/user1m/botbuilder-timeout)
[![maintained](https://img.shields.io/maintenance/yes/2017.svg)](https://github.com/user1m/botbuilder-timeout/graphs/commit-activity)  

> © 2017, Claudius Mbemba ([@user1m](https://github.com/user1m)). MIT License.

Module for Microsoft Bot Framework to enable your bot to prompt the user if the bot detects inactivity and ultimately end the conversation if no user activity after a defined period of time.

Example:

![Example Screenshot](./images/timeout.png)

## Installation

```shell
npm install botbuilder-timeout --save-dev
```

_Tested on Node.js v8 or newer._


## Usage

```js
const timeout = require("./timeout");

const convoTimeoutOptions = {
    PROMPT_IF_USER_IS_ACTIVE_MSG: "Hey are you there?",
    PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT: "Yes I am",
    PROMPT_IF_USER_IS_ACTIVE_TIMEOUT: 15000,
    END_CONVERSATION_MSG: "Conversation Ended",
    END_CONVERSATION_TIMEOUT: 10000
};

const bot = new builder.UniversalBot(connector);

timeout.setConversationTimeout(bot, convoTimeoutOptions);

```

### Options


| Option   | Description |
| -------- | ----------- |
| <h4>**`PROMPT_IF_USER_IS_ACTIVE_MSG`**</h4> `String` | Default: `'Are you there?'`. String presented to user to confirm activity
| <h4>**`PROMPT_IF_USER_IS_ACTIVE_BUTTON_TEXT`**</h4> `String` | Default: `'Yes'`. String for button during prompt checking for activity
| <h4>**`PROMPT_IF_USER_IS_ACTIVE_TIMEOUT`**</h4> `Number` | Default: `30000`. Time in `miliseconds` before prompt is presented
| <h4>**`END_CONVERSATION_MSG`**<h4> `Number` | Default: `"Ending conversation since you've been inactive too long. Hope to see you soon."` String sent to user when conversation is ended
| <h4>**`END_CONVERSATION_TIMEOUT`**<h4> `Number` | Default: `15000`. Time in `miliseconds` before conversation is ended with `END_CONVERSATION_MSG` message |

### Full Example with Botbuilder (Node.js)

```js
import express = require('express');
import * as builder from 'botbuilder';
import { setConversationTimeout } from "./timeout";

console.log(`BOT ID: ${process.env.MICROSOFT_APP_ID}\nBOT PASS: ${process.env.MICROSOFT_APP_PASSWORD}`);

// Create bot and add dialogs
const server = express();
const port = process.env.port || process.env.PORT || 3978;
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);

bot.dialog('/', (session, args, next) => {
    session.send('Hello World');
});

const convoTimeoutOptions = {
    PROMPT_IF_USER_IS_ACTIVE_MSG: "Hey are you there?",
    PROMPT_IF_USER_IS_ACTIVE_TIMEOUT: 15000,
    END_CONVERSATION_MSG: "Conversation Ended",
    END_CONVERSATION_TIMEOUT: 10000
};

setConversationTimeout(bot, convoTimeoutOptions);

server.post('/api/messages', connector.listen());
server.listen(port, () => {
    console.info(`Server Up: Listening at port ${port}`);
});
```

## Change-Log

See [CHANGELOG.md](https://github.com/user1m/botbuilder-timeout/blob/master/CHANGELOG.md).

## License

See [MIT](https://github.com/user1m/botbuilder-timeout/blob/master/LICENSE).
