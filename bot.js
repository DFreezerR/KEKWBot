const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const prefix = "KEKW";
let working = true;

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
              message.channel.send("'FUCK YOU'ed "+config.count+" times.");
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
              message.channel.send(input[2] +" "+input[3]);
            } break;
            case 'eval':
            {
              let evaling = input.splice(0,2).map(e=>e.trim());
              message.channel.send(eval(evaling));
              message.channel.send(evaling);
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
          config.count++;
        }
      }
    }

});

bot.login(process.env.token);