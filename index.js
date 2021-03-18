//#region Helper
const fs = require("fs");
const data = readData();
const config = readConfig();
const generator = require("generate-password");
const expiryAddition = config["hours-before-expiry"] * 60 * 60 * 1000;



init();

// Initializing all data needed.
function init() {
  let fileDir = "./files/";

  if (!fs.existsSync(fileDir)) {
    //Setup File Directory if missing
    fs.mkdirSync(fileDir);
    fs.writeFileSync("files.json", JSON.stringify({}), { encoding: "utf-8" });
  }

  if(!fs.existsSync('./style/' + config["style"] + '.css')){
    console.log("[fastcloud]: There is no stylesheet under ./style/" + config["style"] + ".css!\n"
    +"[fastcloud]: Create it or switch to a existing stylesheet via editing the config file.");
    process.exit(1);
  }

  console.log("Starting fastcloud with expiry of " + expiryAddition + " ms.");
}

//Read list of files known
function readData() {
  let raw;
  if (fs.existsSync("files.json")) {
    raw = fs.readFileSync("files.json");
  } else {
    raw = "{}";
  }
  return JSON.parse(raw);
}

//Read config file
function readConfig() {
  let raw;
  if (fs.existsSync("config.json")) {
    raw = fs.readFileSync("config.json");
  } else {
    throw "No config file!";
  }
  return JSON.parse(raw);
}

//Generator for random file names used internally.
function getNewFileName() {
  let name = generator.generate({
    length: 20,
    numbers: true,
  });

  //Generate until the file is unique
  while (data[name]) {
    name = generator.generate({
      length: 20,
      numbers: true,
    });
  }

  return name;
}

/*
Structure:
    {
        file: name,
        type: type (ending)
        maxd: max-downloads
        expi: Expiry Date/Time
    }

    Planned:    Expiry date (Autodelete)
*/
//Set file inside the file-data list
function setFile(_name,_oldname, _type, _maxd, _expiry) {
  data[_name] = {
    file: _name,
    name: _oldname,
    type: _type,
    maxd: _maxd,
    expi: _expiry,
  };

  fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

//Delete a file and delete it out of the file-data list
function deleteFile(_name, _type, _skipSave) {
  if (fs.existsSync(__dirname + "/files/" + _name + "." + _type))
    fs.unlinkSync(__dirname + "/files/" + _name + "." + _type);
  delete data[_name];
  if (!_skipSave)
    fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

//Put the string inside the overall html-layout.
//GoUp should be true if the base url is a level below the current one
//=> Keep relative link working (Like 127.0.0.1:42069/thing/d)
function htmlify(title, text, goup) {
  return(
    "<!DOCTYPE html><html><head><title>" +
    title +
    '</title><link rel="icon" type="image/png" href="' +
    (goup == true ? '../Icon.png">' : './Icon.png">') +
    '<link rel="stylesheet" href="' +
    (goup == true ? '../stylesheet">' : './stylesheet">') +
    '</head><body><div id="all">' +
    '<div class="container"><a href="https://github.com/bluewingtitan/fastcloud"><img src="' +
    (goup == true ? '../Banner.png">' : './Banner.png">') +
    '</a></div><br><div class="container"><h2>' +
    text +
    "</h2></div></div></body></html>");
}

//#endregion

//#region 'Netcode'
const express = require("express");
const fileUpload = require("express-fileupload");
const e = require("express");
const { setInterval } = require("timers");
const { application } = require("express");
const processMultipart = require("express-fileupload/lib/processMultipart");
const app = express();
app.use(fileUpload());
const port = 33658;

//Make folder statics (Images and css) work more easily
app.use(express.static("statics"));

//Serve index file
app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

//Serve hosted file
app.get("/d/:name", (req, res) => {
  let name = req.params.name;

  //Check if file even exists
  if (data[name]) {
    //res.sendFile("./files/" + name + data[name].type, { root: __dirname });
    const file = `${__dirname}` + "/files/" + name + "." + data[name].type;

    //Infinitely Downloadable files have maxd==1
    const infiniteDownloads = data[name].maxd == -1;

    if (!infiniteDownloads)
      //Only decrease if not infinite
      setFile(name, data[name].name, data[name].type, data[name].maxd - 1, data[name].expi);

    //Only send file if not expired
    if (data[name].maxd >= 0 || infiniteDownloads) {
      res.download(file, data[name].name);
    } else {
      //Send error
      return res.send(
        htmlify(
          "Expired!",
          "The File has sadly reached it's maximum amount of downloads and is due to deletion.",
          true
        )
      );
    }

    if (data[name].maxd <= 0) {
      //Delete the file if expired
      deleteFile(name, data[name].type, false);
    }
  } else {
    //If file does not exist
    res.send(
      htmlify(
        "*Sad 404 Noises*",
        "The File sadly does not seem to exist. Maybe it expired or has reached max downloads?",
        true
      )
    );
  }
});

//Upload functionality
app.post("/upload", function (req, res) {
  let sampleFile, uploadPath, filetype, filename;

  if (!req.files || Object.keys(req.files).length === 0) {
    //Check body for files
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

  //Check if password is right
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

  //Check if file is too big
  //If using a reverse proxy check if the max upload limit even is allowing for your file size
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

  //Beautiful code to get the file ending
  filetype = sampleFile.name.split(".");
  filetype = filetype[filetype.length - 1];

  filename = getNewFileName(); //Get new name to save the file as

  //File to upload to
  uploadPath = __dirname + "/files/" + filename + "." + filetype;

  //Tell fastcloud that this file exists
  setFile(
    filename,
    sampleFile.name,
    filetype,
    config["max-downloads"],
    Date.now() + expiryAddition //Current Unix-Timecode + ExpirySeconds
  );

  // using mv() to place the file on the server
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

//Start the server
app.listen(port, () => {
  console.log("fastcloud v1.1 listening at http://localhost:" + port);
});

//#endregion

//#region File Deletion

setInterval(timePurge, 30 * 60 * 1000); //Once every 30 minutes -> Accurate enough for FastCloud-UseCases

//Purge files that are too old.
function timePurge() {
  let currentTime = Date.now();

  try {
    for (const [key, e] of Object.entries(data)) {
      if (e.expi < currentTime) {
        deleteFile(e.file, e.type, true);
      }
    }
  } catch {
    //This mostly exists for the case when there are just no files.
    //I could check for that...
    //I also could do something more valuable in that time.
  }

  fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

timePurge(); //One-Shot at start to make sure very old files get deleted instantly after long off-times.

//#endregion
