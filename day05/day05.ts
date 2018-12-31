import * as fs from "fs";
import * as path from "path";
import * as _ from "lodash";

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

function fullyReact(s: string) {
  while (true) {
    const sn = triggerReaction(s);
    if (s === sn) {
      return s;
    } else {
      s = sn;
    }
  }
}

function part1(lines: string[]) {
  let s = lines[0];
  s = fullyReact(s);
  console.log(`Resulting string=${s}`);
  console.log(`Part 1=${s.length}`);
}

function part2(lines: string[]) {
  const s = lines[0];
  let shortestPolymer = s;
  for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
    const sFiltered = _.filter(
      s,
      it => it.charCodeAt(0) !== i && it.charCodeAt(0) !== i - 32
    ).join("");
    const sReacted = fullyReact(sFiltered);
    if (sReacted.length < shortestPolymer.length) {
      shortestPolymer = sReacted;
    }
  }
  console.log(`Result string for Part 2=${shortestPolymer}`);
  console.log(`Part 2=${shortestPolymer.length}`);
}

const inputFilepath = path.resolve(__dirname, "input");
fs.readFile(inputFilepath, "utf8", (err, data) => {
  if (err) {
    console.error(`${err}`);
    return;
  }
  const lines = data.split("\n");
  console.time("Part 1");
  part1(lines);
  console.timeEnd("Part 1");
  console.time("Part 2");
  part2(lines);
  console.timeEnd("Part 2");
});
