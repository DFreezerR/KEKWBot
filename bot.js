const Discord = require('discord.js');
const bot = new Discord.Client();
var count = 0;
bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    
    if (message.author.bot != true) 
    {
      if(message.content == "KEKW Count")
      {
        message.channel.send("'FUCK YOU'ed "+count+" times.");
      }
      message.reply("FUCK YOU");
      count++;
    }

});

bot.login(process.env.token);