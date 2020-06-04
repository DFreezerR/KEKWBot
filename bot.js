const Discord = require('discord.js');
const bot = new Discord.Client();
var working = true;
var count = 0;
//var fs = require('fs');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    var prefix = "KEKW ";
    var input = message.content.substr(0,5);
    if (input == prefix && message.author.bot != true) 
    {
      var command = message.content.substr(5, message.content.length-1).trim;
      switch(command)
      {
        case 'count':
          {
            message.channel.send("'FUCK YOU'ed "+count+" times.");
          } break;
        case 'switch':
          {
            working = !working;
          } break;
        default:
          {
            
          } break;
      }
    }
    else
    {
      if(working && message.author.bot != true)
            {
              message.reply("FUCK YOU");
              count++;
            }
    }

});

bot.login(process.env.token);