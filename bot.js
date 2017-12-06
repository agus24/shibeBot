const Discordie = require('discordie');
const fs = require('fs');
const RainbowSixApi = require('rainbowsix-api-node');
const R6 = new RainbowSixApi();

const Events = Discordie.Events;
const Client =new Discordie;

Client.connect({
    token : "Mzg3NDg0MTA2NjcxMjU5NjU3.DQfMpQ.4BX-iebI8clLGgPn3wqXlXc-l7A"
});

Client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('connected as '+ Client.User.Username);
});

Client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    if(e.message.content.indexOf("stats") > -1) {
        console.log('a');
        checkStat(e.message.content.split(" ")[1], e)
    }
});


function checkStat(username,e) {
    let platform = 'uplay';

    //Get stats on the user on that platform
    R6.stats(username, platform).then(response => {
        e.message.channel.sendMessage({embed: {
            color: 3447003,
            title: "This is an embed",
            url: "http://google.com",
            description: "This is a test embed to showcase what they look like and what they can do.",
            fields: [{
                name: "Fields",
                value: "They can have different fields with small headlines."
              },
              {
                name: "Masked links",
                value: "You can put [masked links](http://google.com) inside of rich embeds."
              },
              {
                name: "Markdown",
                value: "You can put all the *usual* **__Markdown__** inside of them."
              }
            ],
            timestamp: new Date()
          }
        });
    }).catch(error => {
        console.error(error)
    });
}
