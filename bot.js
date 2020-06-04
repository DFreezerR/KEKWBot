const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    
    if (message.author.bot != true) 
    {
        message.reply("FUCK YOU");
    }

});

bot.login(process.env.token);