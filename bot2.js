let Discord = require("discord.js");
let RainbowSixApi = require('rainbowsix-api-node');
let config = require("./auth.json");
let fs = require('fs');

const R6 = new RainbowSixApi();
const client = new Discord.Client();

let prefix = config.prefix;
client.login(config.token);

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.startsWith(prefix + "stats")) {
    let username = message.content.split(" ")[1];
    let platform = "uplay";
    console.log(username);
    checkStats(username, platform, message);
  } else if (message.content.startsWith(prefix + "foo")) {
    message.channel.send("bar!");
  } else if (message.content.startsWith(prefix + "profile")) {
    let username = message.content.split(" ")[1];
    let platform = "uplay";
    console.log(username);
    getProfile(username, platform, message);
  }else if (message.content.startsWith(prefix + "operator")) {
    let username = message.content.split(" ")[2];
    let operator = message.content.split(" ")[1];
    let platform = "uplay";
    console.log(username);
    console.log(operator);
    checkFullStats(username, platform, operator, message);
  }
});

function checkStats(username, platform, message) {
    R6.stats(username, platform).then(response => {
        // message.channel.send({embed: {
        //   color: 3447003,
        //   description: response.player.username
        // }});
        message.channel.sendMessage({embed: {
            color: 3447003,
            title: "Ranked",
            description: "This is " + response.player.username + " Ranked Record",
            fields: [{
                name: "Wins / Lose",
                value : response.player.stats.ranked.wins + " / " + response.player.stats.ranked.losses + " ( " + response.player.stats.ranked.wlr + "% ) "
              },
              {
                name: "Kill / Death : ",
                value : response.player.stats.ranked.kills + " / " + response.player.stats.ranked.deaths + " ( " + response.player.stats.ranked.kd + "% ) "
              }
            ],
            timestamp: new Date()
          }
        });
        message.channel.sendMessage({embed: {
            color: 3447003,
            title: "Casual",
            description: "This is " + response.player.username + " Casual Record",
            fields: [{
                name: "Wins / Lose",
                value : response.player.stats.casual.wins + " / " + response.player.stats.casual.losses + " ( " + response.player.stats.casual.wlr + "% ) "
              },
              {
                name: "Kill / Death : ",
                value : response.player.stats.casual.kills + " / " + response.player.stats.casual.deaths + " ( " + response.player.stats.casual.kd + "% ) "
              }
            ],
            timestamp: new Date()
          }
        });
    }).catch(error => {
        message.channel.sendMessage({embed: {
          color: 3447003,
          description: "Shibe Bot is Trying to find that name but unfortunately that username doesnt exists :("
        }});
    });
}

function checkFullStats(username, platform, operator, message) {
    R6.stats(username, platform, true).then(response => {
        let data = [];
        for (var i = response.operator_records.length - 1; i >= 0; i--) {
            if(response.operator_records[i].operator.name == operator) {
                data = response.operator_records[i].stats;
                message.channel.sendMessage({embed: {
                    color: 3447003,
                    title: operator,
                    description: "This is " + username + " "+ operator +" Record",
                    fields: [{
                        name: "Wins / Lose",
                        value : data.wins + " / " + data.losses + " ( " + (data.wins / data.losses) + "% ) "
                      },
                      {
                        name: "Kill / Death : ",
                        value : data.kills + " / " + data.deaths + " ( " + (data.kills / data.deaths) + "% ) "
                      }
                    ],
                    timestamp: new Date()
                  }
                });
                break;
            }
        }
    }).catch(error => {
        message.channel.sendMessage({embed: {
          color: 3447003,
          description: "Shibe Bot is Trying to find that name but unfortunately that username doesnt exists :("
        }});
    });
}

function getProfile(username, platform, message) {
    R6.profile(username, platform).then(response => {
        console.log(response);
        fs.writeFile("output/profile.json", JSON.stringify(response), err => {
             if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }).catch(error => {
        message.channel.sendMessage({embed: {
          color: 3447003,
          description: "Shibe Bot is Trying to find that name but unfortunately that username doesnt exists :("
        }});
    });
}
