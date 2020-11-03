const Discord = require('discord.js');
const urlExist = require("url-exist");
const https = require('https');
const configPath = './config.json';
const { Client, Pool } = require('pg');
const utils = require('./utils');
const config = require(configPath);
const bot = new Discord.Client();
const prefix = config.prefix;
let working = true;
let count = config.count;
let chance = config.chance;
let react = config.react;
let mode = "normal";
let active = false;
let banHorny = ['horny','хорни','нorny','hоrny','hornу','ноrny','ноrnу','hоrnу','h0rny','х0рни','xорни','хоpни','хорhи','xopни','h◌rny','hогnу'];
const dbConfig = 
{
  connectionString: process.env.DATABASE_URL,
  ssl: 
  {
    rejectUnauthorized: false
  }
}
const pool = new Pool(dbConfig);
const client = new Client(dbConfig);
bot.on('ready', () => 
{
  console.log(`Logged in as ${bot.user.tag}!`);
});
let getImgurImg = (id) =>
{
  return new Promise((resolve, reject) =>
  {
    const options = {
      hostname: 'i.imgur.com',
      port: 443,
      path: "/"+id+".jpeg",
      method: 'GET'
    }
    const req = https.request(options, res => 
    {
      //console.log(id);
      if(res.statusCode == 200)
      {
        let url = 'https://i.imgur.com/'+id+'.jpg';
        //console.log(url);
        resolve(url);
      }
      else
      {
        reject(new Error("No Image!"));
      }
    })
    req.end();
  }); 
}
let CreateEmbed = (user, image) =>
{
  return new Discord.MessageEmbed()
        .setColor('#FF00FF')
        .setTitle('Your image')
        .setAuthor(user.tag, user.avatarURL)
        .setDescription(image)
        .attachFiles(image)
        .setImage(image)
        .setTimestamp()
        .setFooter('OWO');
   
}
bot.on('message', message => 
{
    let allowedRole = message.member.roles.cache.some(role=>role.name==="OWO");
    if(message.author.bot != true)
    {
      banHorny.forEach((e)=>
      {
        if(message.content.toLowerCase().includes(e))
        {
          message.delete();
          return;
        }
      });
      
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
            case 'insert':
              {
                pool.connect((e,client,done) =>
                {
                  if (e) return console.error('connection error',e);
                  client.query('INSERT INTO blacklist_words (word) values ($1)',[input[2]]).then(res=>
                    {
                      done();
                      console.warn(input[2]+" inserted!");
                    }).catch(e=>
                      {
                        return console.error(e);
                      });
                });
              
              } break;
            case 'select':
              {
                pool.connect((e,client,done) =>
                {
                  if (e) return console.error('connection error',e);
                  client.query('SELECT * FROM blacklist_words').then(res =>
                    {
                      console.warn("Starting printing!");
                      for (let row of res.rows) 
                      {
                        message.channel.send(JSON.stringify(row));
                      }
                    }).catch(e=>
                      {
                        return console.error(e);
                      });
                });
                
              } break;
            case 'switch':
            {
              if(message.member.roles.some(e=>e.name === "OWO" || e.name === "DJ"))
              {
                working = !working;
                let state = working == true ? "on" : "off";
                message.channel.send("'FUCK YOU' option turned "+ state);
              }
              else
              {

              }
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
              if(allowedRole)
              {
                let value = input[2];
                if(value[value.length-1] == "%")
                {
                  value = value.slice(0,-1);
                }
                chance = value;
                message.reply('You changed the probability of being "FUCK YOU"ed to '+value+'%!');
              }
              else
              {
                message.reply('You do not have permissions to do this!');
              }

            } break;
            case 'react':
            {
              if(allowedRole)
              {
                let value = input[2];
                if(value[value.length-1] == "%")
                {
                  value = value.slice(0,-1);
                }
                react = value;
                message.reply('You changed the probability of being reacted to '+value+'%!');
              }
              else
              {
                message.reply('You do not have permissions to do this!');
              }

            } break;
            case 'display':
            {
              message.channel.send('The probability of being "FUCK YOU"ed is '+chance+'%!\nThe probability of being reacteded is '+react+'%!');

            } break;
            case 'pic':
            {
              (function a()
              {
                getImgurImg(utils.getImgurId(utils.random(5,7))).then((resolve) =>
                {
                  let embed = CreateEmbed(message.member.user,resolve);
                  //console.log("Embed created");
                  message.channel.send(embed);

                }).catch((error) =>
                {
                  //console.log(error.message);
                  a();
                });
              })();
            } break;
            case 'help':
            {
              message.channel.send(utils.help);

            } break;
            case 'mode':
              {
                if(allowedRole)
                {
                  switch(input[2])
                  {
                  case 'normal':
                    {
                      mode = "normal";
                      message.reply('Changed to normal mode');
                    }break;
                  case 'special':
                    {
                      mode = "special";
                      message.reply('Changed to special mode');
                    }break;
                  default:
                    {
                      message.reply("Wrong mode!");
                    } break;
                  }
                }
                else
                {
                  message.reply('You do not have permissions to do this!');
                }
              } break;
              case 'ping':
                {
                  let who = input[2];
                  if(who == '<@!207964835999121411>') return;
                  //console.log(who);
                  active = true;
                  if(who == 'stop') active = false;
                  if(active)
                  {
                    let spam = setTimeout(function send()
                    {
                      //console.log(active);
                      if(active)
                      {
                        message.channel.send(who);
                        spam = setTimeout(send,2000);
                      }
                    }, 2000); 
                  }
                } break;
          default:
            {
            
            } break;
        }
      }
      else
      {
        if(working && message.member.user.tag == "vaytvi#4838" && mode == "special")
        {
          if(utils.random(0,100)<=chance)
          {
            message.reply("FUCK YOU");
          }
          count++;
          
        }
        if(working && mode == "normal")
        {
          if(utils.random(0,100)<=chance)
          {
            message.reply("FUCK YOU");
          }
          count++;
        }
      }
      if(utils.random(0,100)<=react)
      {
        message.react(utils.getRandomReactEmote());
      }
      if(utils.random(0,100)<=react)
      {
        message.reply(utils.getRandomEmote());
      }
    }

});

bot.login(process.env.token);