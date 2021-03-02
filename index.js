//#region Helper
const fs = require("fs");
const data = readData();
const config = readConfig();
var generator = require("generate-password");

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
    }

    Planned:    Expiry date (Autodelete)
                Message
                Multi-Filex
*/

function setFile(_name, _type, _maxd) {
  data[_name] = {
    file: _name,
    type: _type,
    maxd: _maxd,
  };

  fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

function deleteFile(_name, _type) {
  fs.unlinkSync(_name + "." + _type);
  delete data[_name];
  fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

//#endregion

//#region Netcode
const express = require("express");
const fileUpload = require("express-fileupload");
const e = require("express");
const app = express();
app.use(fileUpload());
const port = 33658;

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/file/:name", (req, res) => {
  let name = req.params.name;
  if (data[name]) {
    //res.sendFile("./files/" + name + data[name].type, { root: __dirname });
    const file = `${__dirname}` + "/files/" + name + "." + data[name].type;
    setFile(name, data[name].type, data[name].maxd - 1);

    if (data[name].maxd > 0) {
      res.download(file);
    }

    if (data[name].maxd < 0) {
      deleteFile(name, data[name].type);
    }
  } else {
    res.send(
      "The File sadly does not seem to exist. Maybe it expired or has reached max downloads?"
    );
  }
});

app.post("/upload", function (req, res) {
  let sampleFile, uploadPath, filetype, filename;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .send(
        "<html><head><title>Crickets Chirping...</title>" +
          "<style>body{font-family: Arial, Helvetica, sans-serif;color: #ECEFF4;background-color: #2E3440;}" +
          "p{margin-top:50vh;text-align:center;}" +
          "</style>" +
          "</head><body><p>" +
          "No Files to upload appended. Nothing happened." +
          "</p></body></html>"
      );
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;

  if (sampleFile.size > config["max-size-byte"]) {
    res.type(".html");
    return res.send(
      "<html><head><title>Error!</title>" +
        "<style>body{font-family: Arial, Helvetica, sans-serif;color: #ECEFF4;background-color: #2E3440;}" +
        "p{margin-top:50vh;text-align:center;}" +
        "</style>" +
        "</head><body><p>" +
        "Your file is too big. Your file can be " +
        config["max-size-byte"] / 1024 / 1024 +
        "mb at max." +
        "</p></body></html>"
    );
  }

  filetype = sampleFile.name.split(".");
  filetype = filetype[filetype.length - 1];

  filename = getNewFileName();

  uploadPath = __dirname + "/files/" + filename + "." + filetype;

  setFile(filename, filetype, config["max-downloads"]);

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.type(".html");
    const url = req.hostname + "/file/" + filename;
    const relURL = "/file/" + filename;
    res.send(
      "<html><head><title>File Uploaded!</title>" +
        "<style>body{font-family: Arial, Helvetica, sans-serif;color: #ECEFF4;background-color: #2E3440;}" +
        "p{margin-top:50vh;text-align:center;}" +
        "a{color: #ECEFF4;}" +
        "</style>" +
        "</head><body><p>" +
        "File uploaded! Send this link to share the file:<br>" +
        "<a href='" +
        relURL +
        "'>" +
        url +
        "</a>" +
        "</p></body></html>"
    );
  });
});

app.listen(port, () => {
  console.log("fastcloud v1.1 listening at http://localhost:" + port);
});

//#endregion
