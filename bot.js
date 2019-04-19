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
    console.log(
      ctx.message.from.id +
        "-" +
        ctx.message.from.username +
        ": " +
        ctx.message.photo[ctx.message.photo.length - 1].file_id
    );
    let fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    /**Fetches file_path aka. the file name, then passes the URL to download to downloadFile */
    telegram.getFile(fileId).then(fileInfo => {
      telegram
        .getFileLink(fileId)
        .then(data => downloadFile(fileInfo.file_path, data));
    });
    ctx.reply("Received Image");
  });
  bot.on("document", ctx => {
    console.log(ctx.message);
    let fileId = ctx.message.document.file_id;
    telegram.getFile(fileId).then(fileInfo => {
      telegram
        .getFileLink(fileId)
        .then(downloadPath => downloadFile(fileInfo.file_path, downloadPath));
    });
    ctx.reply("Received File");
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
  console.log("Starting Bot");
  bot.launch();
};
/** this function should by async */
function downloadFile(filePath, downloadPath) {
  let fileName = filePath.split("/")[1]
  console.log("Downloading:", fileName);
  // console.log(downloadPath);

  let dest = `./public/images/${fileName}`;
  var file = fs.createWriteStream(dest);
  var request = https
    .get(downloadPath, function(response) {
      response.pipe(file);
      file.on("finish", function() {
        file.close(); // close() is async, call cb (close(cb))after close completes.
        console.log("Done downloading:", fileName);
      });
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
      console.log("Error downloading:", fileName);
    });
}
