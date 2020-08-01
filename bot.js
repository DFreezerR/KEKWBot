const Discord = require('discord.js');
const urlExist = require("url-exist");
const configPath = './config.json';
const utils = require('./utils');
const config = require(configPath);
let fs = require('fs');
const bot = new Discord.Client();
const prefix = config.prefix;
let working = true;
let count = config.count;
let chance = config.chance;
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
              message.channel.send(utils.random(min, max));
            } break;
            case 'eval':
            {
              input.splice(0,2)
              let a = message.content.substr(prefix.toString().length+command.length+2, message.content.length-1);
              let output = eval(a);
              if(output === undefined) return;
              message.channel.send(output);
            } break;
            case 'chance':
            {
              let value = input[2];
              if(value[value.length-1] == "%")
              {
                value = value.slice(0,-1);
              }
              chance = value;
              message.reply('You changed the probability of being "FUCK YOU"ed to '+value+'%!');

            } break;
            case 'pic':
            {
              let sendRandomPic = () =>
              {
                let id = utils.getImgurId(utils.random(5,7));
                let url = "http://i.imgur.com/" + id;
                (async () => {
                  const exists = await urlExist(url);
                  if(exists)
                  {
                    let embed = new Discord.MessageEmbed()
                    .setColor('#FFFF00')
                    .setTitle('Your image')
                    .setAuthor('Devoto')
                    .setDescription('Random image from Imgur')
                    .setImage(url+'.jpg')
                    .setTimestamp()
                    .setFooter('OWO');
                    message.channel.send(embed);
                  }
                  else
                  {
                    sendRandomPic();
                  }
                })();
              }
              sendRandomPic();
            } break;
            case 'help':
            {
              message.channel.send(utils.help);
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
          if(utils.random(0,100)<=chance)
          {
            message.reply("FUCK YOU");
          }
          count++;
          
        }
      }
    }

});

bot.login(process.env.token);