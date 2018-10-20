'use strict';

const line = require('@line/bot-sdk');
const express = require('express');


// Exception Error
const HTTPError = require('@line/bot-sdk').HTTPError;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const ReadError = require('@line/bot-sdk').ReadError;
const RequestError = require('@line/bot-sdk').RequestError;
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;

const config = {
  channelAccessToken: 'CHANNEL_ACCESS_TOKEN',
  channelSecret: 'CHANNEL_SECRET'
};


const app = express();
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
})

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  switch(event.message.text)
  {
      case 'bye': 
            

            // Leave from Room or Group
            if (event.source.type === 'room') {
                // Send Bye bye message
                client.replyMessage(event.replyToken, { type: 'text', text: 'Bye bye'});

                // Leave from Room
                client.leaveRoom(event.source.roomId);
            } else if (event.source.type === 'group') {
                // Send Bye bye message
                client.replyMessage(event.replyToken, { type: 'text', text: 'Bye bye'});

                // Leave from Group
                client.leaveGroup(event.source.groupId);
            }
            break;
      default: 
            // Echo message
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: event.message.text
            });
            break;
  }
  
}

app.use((err, req, res, next) => {
    if (err instanceof SignatureValidationFailed) {
        // res.status(401).send(err.signature)
        res.status(401).send("Unauthorized")
        return
    } else if (err instanceof JSONParseError) {
        res.status(400).send(err.raw)
        return
    }
    next(err) // will throw default 500
});

console.log("Start Server at port 3000");
app.listen(3000);
