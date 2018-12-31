import * as fs from "fs";
import * as path from "path";

function isLower(s: string) {
  return s === s.toLowerCase();
}

function isUpper(s: string) {
  return s === s.toUpperCase();
}

function removeChars(s: string, j: number, k: number) {
  const newString = s.slice(0, j) + s.slice(k + 1, s.length);
  return newString;
}

function triggerReaction(s: string): string {
  let trigger: [number, number] | undefined;
  for (let i = 0; i < s.length - 1; i++) {
    const l1 = s[i];
    const l2 = s[i + 1];
    if (isLower(l1)) {
      if (l1 !== l2 && l1 === l2.toLowerCase()) {
        trigger = [i, i + 1];
        break;
      }
    } else if (isUpper(l1)) {
      if (l1 !== l2 && l1 === l2.toUpperCase()) {
        trigger = [i, i + 1];
        break;
      }
    } else {
      throw new Error(`not lower or uppercase character!`);
    }
  }
  if (trigger === undefined) {
    return s;
  }
  const [j, k] = trigger;
  return removeChars(s, j, k);
}

function part1(lines: string[]) {
  let s = lines[0];
  while (true) {
    const sn = triggerReaction(s);
    if (s === sn) {
      break;
    } else {
      s = sn;
    }
  }
  console.log(`Resulting string=${s}`);
  console.log(`Part 1=${s.length}`);
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
