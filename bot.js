const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = "KEKW";
let working = true;
let count = 0;

//var fs = require('fs');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    
    if(message.author.bot != true)
    {
      let input = message.content.trim().split(" ");
      let command = input.splice(0,1);
      console.log("input",{input});
      console.log("command",command);
      console.log(input[0]);
      console.log(input[1]);
      console.log(message.content.trim());
      console.log(message.content.split(" "));
      console.log(message.content.split(' '));
      if (input[0] == prefix) 
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
        if(working)
        {
          message.reply("FUCK YOU");
          count++;
        }
      }
    }

});

bot.login(process.env.token);