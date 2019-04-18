const express = require("express");
const app = express();
const port = 3000;

const fs = require("fs");
const config = require("./config");

const bot = require("./bot.js");

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/images", (req, res) => {
  var dir = "./public/images/";

  var files = fs.readdirSync(dir);
  files.sort(function(a, b) {
    return (
      fs.statSync(dir + b).mtime.getTime() -
      fs.statSync(dir + a).mtime.getTime()
    );
  });

  var imageArray = [];
  files.forEach(element => {
    imageArray.push({
      name: element,
      mtime: fs.statSync(dir + element).mtime.getTime()
    });
  });
  var imageJSON = { imageArray };
  res.send(imageJSON);
});

app.get("/file/:name", function(req, res, next) {
  var options = {
    root: __dirname + "/public/images",
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function(err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

bot.launch();
