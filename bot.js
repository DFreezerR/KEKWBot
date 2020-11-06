const Discord = require('discord.js');
const urlExist = require("url-exist");
const https = require('https');
const configPath = './config.json';
const { Client, Pool } = require('pg');
const utils = require('./utils');
const { cli } = require('winston/lib/winston/config');
const config = require(configPath);
const bot = new Discord.Client();
const prefix = config.prefix;
let working = true;
let count = 0;
let chance = config.chance;
let react = config.react;
let mode = "normal";
let active = false;
let banHorny = [];
const dbConfig = 
{
  connectionString: process.env.DATABASE_URL,
  ssl: 
  {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 1000
}
const pool = new Pool(dbConfig);
//const client = new Client(dbConfig);
pool.on('error', (err, client) => 
{
  console.error('Unexpected error on idle client', err);
})
bot.on('ready', () => 
{
  console.log(`Logged in as ${bot.user.tag}!`);
  pool.connect().then(client =>
    {
      return client.query('SELECT * FROM blacklist_words').then(res =>
        {
          client.release();
          for (let row of res.rows) 
          {
            banHorny.push(row['word']);
          }
        }).catch(e=>
          {
            client.release();
            console.error(e);
          });
    }).catch(e=> console.error("Pool connection error!",e));
  pool.connect().then(client =>
  {
    return client.query('SELECT value FROM config_variables WHERE key = \'count\'').then(res=>
      {
        console.log(res);
        count = res.rows[0]

      }).catch(ee=>
        {
          client.release();
          console.error(ee);
        });
  }).catch(e=> console.error("Pool connection error!",e));
  //console.log(banHorny);
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
    if(banHorny.length > 0 && banHorny)
    {
      banHorny.forEach((e)=>
      {
        if(message.content.toLowerCase().includes(e))
        {
          message.delete();
          return;
        }
      });
    }
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
              if(message.member.roles.cache.some(e=>e.name === "OWO" || e.name === "DJ"))
              {
                pool.connect().then(client =>
                  {
                    let insertWord = message.content.substring(message.content.indexOf("\"")+1, message.content.lastIndexOf("\""));
                    return client.query('INSERT INTO blacklist_words (word) values ($1)',[insertWord]).then(res=>
                      {
                        client.release();
                        banHorny.push(insertWord);
                        console.warn(insertWord+" inserted!");
                        message.react("708697210711310460");
                      }).catch(ee=>
                        {
                          client.release();
                          console.error(ee);
                        });
                  }).catch(e=> console.error("Pool connection error!",e));
              }
              else
              {
                message.reply('You do not have permissions to do this!');
              }
            } break;
          case 'select':
            {
              pool.connect().then(client =>
                {
                  return client.query('SELECT * FROM blacklist_words').then(res =>
                    {
                      client.release();
                      let result = '';
                      for (let row of res.rows) 
                      {
                        result += row['word']+'\n';
                      }
                      message.channel.send(result);
                    }).catch(e=>
                      {
                        client.release();
                        console.error(e);
                      });
                }).catch(e=> console.error("Pool connection error!",e));
            } break;
          case 'switch':
          {
            if(message.member.roles.cache.some(e=>e.name === "OWO" || e.name === "DJ"))
            {
              working = !working;
              let state = working == true ? "on" : "off";
              message.channel.send("'FUCK YOU' option turned "+ state);
            }
            else
            {
              message.reply('You do not have permissions to do this!');
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
let saveCountDB = setInterval(() =>
{
  pool.connect().then(client =>
  {
    return client.query('UPDATE config_variables SET value = $1 WHERE key = \'count\'',[count]).then(res=>
      {
        client.release();
      }).catch(ee=>
        {
          client.release();
          console.error(ee);
        });
  }).catch(e=> console.error("Pool connection error!",e));
},300000);
saveCountDB();
bot.login(process.env.token);