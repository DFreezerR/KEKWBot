let help = '**count**: display number of times people got "FUCK YOU"ed\n**chance**: set chance of getting "FUCK YOU"ed (e.g KEKW chance 20%)\n**switch**: turn off "FUCK YOU" option\n**pic**: post random image from Imgur\n**random**: get random value between two numbers(e.g KEKW random 1 100)\n**help**: show help list\n**mode**: switch "FUCK YOU"\'s mode (**normal**: working on everyone, **spicial**: working on "specified" persons)\n**display**: displays "FUCK YOU"\'s chance';
let random = (min, max) =>
{
  return Math.floor(Math.random() * (+max - +min + 1)) + +min;
}
let getImgurId = (length) => 
{
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) 
  {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
let emotes = 
{
  KEKW: "<:KEKW:708697210711310460>",
  YEP: "<:YEP:710828915828064287>",
  Pepega: "<:Pepega:736925908706787399>",
  key: function(n) 
  {
    return this[Object.keys(this)[n]];
  },
  keys: function()
  {
    return Object.keys(this).length;
  }
}
let getRandomEmote = () =>
{
  return emotes.key(random(0,emotes.keys-3));
}
exports.random = random;
exports.getImgurId = getImgurId;
exports.help = help;
exports.emotes = emotes;
exports.getRandomEmote = getRandomEmote;