import * as fs from "fs";
import * as path from "path";

const lineRegex = /regex here/;
function part1(lines: string[]) {
  for (const s of lines) {
    if (s === "") {
      continue;
    }
  }
}

const inputFilepath = path.resolve(__dirname, "input");
fs.readFile(inputFilepath, "utf8", (err, data) => {
  if (err) {
    console.error(`${err}`);
    return;
  }
  const lines = data.split("\n");
  part1(lines);
});
