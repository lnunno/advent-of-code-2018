import * as fs from "fs";
import * as path from "path";

function findDuplicateFrequency(lines: string[]) {
  let sum = 0;
  const seenBefore = new Set([sum]);
  while (true) {
    for (const numLine of lines) {
      if (numLine === "") {
        continue;
      }
      const num = Number(numLine);
      sum += num;
      if (seenBefore.has(sum)) {
        console.log(`Seen the frequency ${sum} before`);
        return sum;
      }
      seenBefore.add(sum);
    }
  }
}

const inputFilepath = path.resolve(__dirname, "input");
fs.readFile(inputFilepath, "utf8", (err, data) => {
  if (err) {
    console.error(`${err}`);
    return;
  }
  let sum = 0;
  const lines = data.split("\n");
  for (const numLine of lines) {
    const num = Number(numLine);
    sum += num;
  }
  console.log(`Answer is ${sum}`);
  findDuplicateFrequency(lines);
});
