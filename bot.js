const Discord = require('discord.js');
const bot = new Discord.Client();
var working = true;

//var fs = require('fs');

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    var prefix = "KEKW ";
    var input = message.content.substr(0,5);
    if (input == prefix && message.author.bot != true) 
    {
      var command = message.content.substr(5, message.content.length-1).trim.toLowerCase();
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
            if(working)
            {
              message.reply("FUCK YOU");
              count++;
            }
          } break;
      }
      
      /*if(command == "KEKW Count")
      {
        var jsonData = fs.readFileSync('./config.json');
        var count = null;
        try {
          count = JSON.parse(jsonData);
          console.log(count);
          message.channel.send("'FUCK YOU'ed "+count+" times.");*/
        /*}
        catch (err) {
          console.log('There has been an error parsing your JSON.')
          console.log(err);
        }
        
      }
      else
      {
        var options = {
          counter: 0
        };
        var data = JSON.stringify(options);
        fs.writeFile('./config.json', data, function (err) {
          if (err) {
            console.log('There has been an error saving your configuration data.');
            console.log(err.message);
            return;
          }
        });
        message.reply("FUCK YOU");
        count++;
      }*/
    }

});

bot.login(process.env.token);