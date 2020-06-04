const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "KEKW";
var working = true;
var count = 0;

//var fs = require('fs');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    
    var input = message.content.trim.split(" ");
    var command = input.splice(0,1);
    if (input[0] == prefix && message.author.bot != true) 
    {
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