import * as fs from "fs";
import * as path from "path";

const inputFilepath = path.resolve(__dirname, "input");
fs.readFile(inputFilepath, "utf8", (err, data) => {
  if (err) {
    console.error(`${err}`);
    return;
  }
  const lines = data.split("\n");
});
