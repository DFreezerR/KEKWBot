let help = 'count - display number of times people got "FUCK YOU"ed\nswitch - turn off "FUCK YOU" option\npic - post random image from Imgur\nrandom - get random value between two numbers(usage: KEKW random "1st number" "2nd number")\nhelp - show help list';
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
exports.random = random;
exports.getImgurId = getImgurId;
exports.help = help;