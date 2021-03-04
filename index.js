//#region Helper
const fs = require("fs");
const data = readData();
const config = readConfig();
const generator = require("generate-password");
const expiryAddition = config["hours-before-expiry"] * 60 * 60 * 1000;

init();

function init() {
  let fileDir = "./files/";

  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
    fs.writeFileSync("files.json", "{}", { encoding: "utf-8" });
  }

  console.log("Starting fastcloud with expiry of " + expiryAddition + " ms.");
}

function readData() {
  let raw;
  if (fs.existsSync("files.json")) {
    raw = fs.readFileSync("files.json");
  } else {
    raw = "{}";
  }
  return JSON.parse(raw);
}

function readConfig() {
  let raw;
  if (fs.existsSync("config.json")) {
    raw = fs.readFileSync("config.json");
  } else {
    throw "No config file!";
  }
  return JSON.parse(raw);
}

function getNewFileName() {
  let name = generator.generate({
    length: 20,
    numbers: true,
  });

  while (data[name]) {
    name = generator.generate({
      length: 20,
      numbers: true,
    });
  }

  return name;
}

/*
    {
        file: name,
        type: type (ending)
        maxd: max-downloads
        expi: Expiry Date/Time
    }

    Planned:    Expiry date (Autodelete)
*/

function setFile(_name, _type, _maxd, _expiry) {
  data[_name] = {
    file: _name,
    type: _type,
    maxd: _maxd,
    expi: _expiry,
  };

  fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

function deleteFile(_name, _type, _skipSave) {
  fs.unlinkSync(__dirname + "/files/" + _name + "." + _type);
  delete data[_name];
  if (!_skipSave)
    fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

function htmlify(title, text, goup) {
  let r =
    "<!DOCTYPE html><html><head><title>" +
    title +
    '</title><link rel="icon" type="image/png" href="' +
    (goup == true ? '../Icon.png">' : './Icon.png">') +
    '<link rel="stylesheet" href="' +
    (goup == true ? '../index.css">' : './index.css">') +
    '</head><body><div id="all">' +
    '<div class="container"> <img src="' +
    (goup == true ? '../Banner.png">' : './Banner.png">') +
    '</div><br><div class="container"><h2>' +
    text +
    "</h2></div></div></body></html>";
  return r.replace("NaN", ""); //Not sure where the NaN comes from, but this removes it. TODO: WHY?
}

//#endregion

//#region 'Netcode'
const express = require("express");
const fileUpload = require("express-fileupload");
const e = require("express");
const { setInterval } = require("timers");
const app = express();
app.use(fileUpload());
const port = 33658;

app.use(express.static("statics"));

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/d/:name", (req, res) => {
  let name = req.params.name;
  if (data[name]) {
    //res.sendFile("./files/" + name + data[name].type, { root: __dirname });
    const file = `${__dirname}` + "/files/" + name + "." + data[name].type;
    setFile(name, data[name].type, data[name].maxd - 1);

    if (data[name].maxd >= 0) {
      res.download(file);
    } else {
      deleteFile(name, data[name].type);
      res.send(
        htmlify(
          "Expired!",
          "The File has sadly reached it's maximum amount of downloads and is due to deletion.",
          true
        )
      );
    }
  } else {
    res.send(
      htmlify(
        "*Sad 404 Noises*",
        "The File sadly does not seem to exist. Maybe it expired or has reached max downloads?",
        true
      )
    );
  }
});

app.post("/upload", function (req, res) {
  let sampleFile, uploadPath, filetype, filename;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .send(
        htmlify(
          "Crickets Chirping...",
          "No Files to upload appended. Nothing happened.",
          false
        )
      );
  }

  if (
    req.body.password != config["password"] &&
    config["password"].length > 0 //Set pw to empty to skip pw check
  ) {
    return res.send(
      htmlify("Not Allowed!", "Please enter the right password!", false)
    );
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;

  if (sampleFile.size > config["max-size-byte"]) {
    res.type(".html");
    return res.send(
      htmlify(
        "2Heavy4Me!",
        "Your file is too big. Your file can be " +
          config["max-size-byte"] / 1024 / 1024 +
          "mb at max.",
        false
      )
    );
  }

  filetype = sampleFile.name.split(".");
  filetype = filetype[filetype.length - 1];

  filename = getNewFileName();

  uploadPath = __dirname + "/files/" + filename + "." + filetype;

  setFile(
    filename,
    filetype,
    config["max-downloads"],
    Date.now() + expiryAddition
  );

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.type(".html");
    const url = req.hostname + "/d/" + filename;
    const relURL = "/d/" + filename;
    res.send(
      htmlify(
        "Uploaded!",
        "File uploaded! Send this link to share the file:<br>" +
          "<a href='" +
          relURL +
          "'>" +
          url +
          "</a>",
        false
      )
    );
  });
});

app.listen(port, () => {
  console.log("fastcloud v1.1 listening at http://localhost:" + port);
});

//#endregion

//#region File Deletion

setInterval(deleteFiles, 10 * 60 * 1000); //Once every 10 minutes

function deleteFiles() {
  let currentTime = Date.now();

  for (const [key, e] of Object.entries(data)) {
    if (e.expi < currentTime) {
      deleteFile(e.file, e.type, true);
    }
  }

  fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

deleteFiles(); //One-Shot at start to make sure very old files get deleted instantly after long waits.

//#endregion
