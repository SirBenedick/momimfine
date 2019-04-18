const fs = require("fs");
const config = require("./config");
const Telegraf = require("telegraf");
const Telegram = require("telegraf/telegram");
const telegram = new Telegram(config.botToken);
var https = require("https");

module.exports = {};

module.exports.launch = function() {
  const bot = new Telegraf(config.botToken);
  bot.start(ctx => ctx.reply("Hallo, erklärung...."));
  bot.help(ctx => ctx.reply("Schicke mir ein Foto und dies das"));
  // bot.on('sticker', (ctx) => ctx.reply('👍'))
  // bot.hears('hi', (ctx) => ctx.reply('Hey there'))
  // bot.command('hipster', Telegraf.reply('λ'))
  bot.on("photo", ctx => {
    console.log(ctx.message.photo[ctx.message.photo.length - 1].file_id);
    let fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    telegram.getFileLink(fileId).then(downloadFile);
    ctx.reply("Foto");
  });
  bot.on("document", ctx => {
    console.log(ctx.message);
    let fileId = ctx.message.document.file_id;
    telegram.getFileLink(fileId).then(downloadFile);
    ctx.reply("Datei");
  });
  bot.on("message", ctx => {
    console.log(
      ctx.message.from.id +
        "-" +
        ctx.message.from.username +
        ": " +
        ctx.message.text
    );
    return ctx.reply("Hello");
  });
  bot.launch();
};

function downloadFile(filePath) {
  console.log(filePath);
  //get filename dynamic
  //set cb (callback) function
  let dest = "./image.png";
  var file = fs.createWriteStream(dest);
  var request = https
    .get(filePath, function(response) {
      response.pipe(file);
      file.on("finish", function() {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
}
