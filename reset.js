// Execute this script to reset your files properly ('node reset)
// This will only delete all files known to the service to be absolutly sure to not delete any needed files that somehow ended up in the files directory.
const fs = require("fs");
const data = readData();

function readData() {
  let raw;
  if (fs.existsSync("files.json")) {
    raw = fs.readFileSync("files.json");
  } else {
    raw = "{}";
  }
  return JSON.parse(raw);
}

function deleteFiles() {
  let currentTime = Date.now();

  for (const [key, e] of Object.entries(data)) {
    deleteFile(e.file, e.type, true);
  }

  fs.writeFileSync("files.json", JSON.stringify("{}"), { encoding: "utf-8" });
  console.log(
    "Deleted all files known. Delete all left over files in ./files if there are any."
  );
}

function deleteFile(_name, _type, _skipSave) {
  if (fs.existsSync(__dirname + "/files/" + _name + "." + _type))
    fs.unlinkSync(__dirname + "/files/" + _name + "." + _type);
  delete data[_name];
  if (!_skipSave)
    fs.writeFileSync("files.json", JSON.stringify(data), { encoding: "utf-8" });
}

deleteFiles();
