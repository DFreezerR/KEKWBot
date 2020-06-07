const Discord = require('discord.js');
const configPath = './config.json';
const config = require(configPath);
let fs = require('fs');
const bot = new Discord.Client();
const prefix = config.prefix;
let working = false;
let count = config.count;
let random = (min, max) =>
{
  return Math.floor(Math.random() * (+max - +min + 1)) + +min;
}

bot.on('ready', () => 
{
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    
    if(message.author.bot != true)
    {
      let input = message.content.split(" ").map(e=>e.trim());
      if (input[0] == prefix) 
      {
        let command = input[1];
        switch(command)
        {
          case 'count':
            {
              message.channel.send("'FUCK YOU'ed "+count+" times.");
            } break;
          case 'switch':
            {
              working = !working;
              let state = working == true ? "on" : "off";
              message.channel.send("'FUCK YOU' option turned "+ state);
            } break;
            case 'random':
            {
              let min = input[2];
              let max = input[3];
              message.channel.send(random(min, max));
            } break;
            case 'eval':
            {
              input.splice(0,2)
              let a = message.content.substr(prefix.toString().length+command.length+2, message.content.length-1);
              message.channel.send(eval(a));
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
          config.count = count;
          fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {if (err) throw err });
        }
      }
    }

});

bot.login(process.env.token);