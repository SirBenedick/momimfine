const express = require("express");
const app = express();
const port = 3000;

const fs = require("fs");

var forkWebserver = require('child_process').fork;
var forkTelegram = require('child_process').fork;
var childWebserver = forkWebserver('./webserver');
var childTelegram = forkTelegram('./bot');

app.get("/", (req, res) => res.send("Hello World!"));

/** Return a JSON including an imageArray, this array includes every file of the directory ordered by the most recent modified files */
app.get("/images", (req, res) => {
  var dir = "./public/images/";
  var options = {
    dotfiles: "deny",
  };
  var files = fs.readdirSync(dir);  
  /** add filter for dot-files */

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

/** Returns the file included in the public/images folder */
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
      console.log(`Error sending file: ${fileName}`)
      next(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.get("/test", (req, res) => {
  console.log(req)
  res.send("test")
});
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}!`));

