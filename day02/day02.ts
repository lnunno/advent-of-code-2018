import * as fs from "fs";
import * as path from "path";

function countLetters(s: string) {
  const counter = new Map();
  for (const l of s) {
    if (counter.has(l)) {
      counter.set(l, counter.get(l) + 1);
    } else {
      counter.set(l, 1);
    }
  }
  return counter;
}

function numLettersWithCount(counter: Map<string, number>, count: number) {
  let n = 0;
  for (const [key, value] of counter.entries()) {
    if (value === count) {
      n += 1;
    }
  }
  return n > 0 ? 1 : 0;
}

function countNumDiffCharacters(s1: string, s2: string) {
  let numDiffChars = 0;
  let similarChars = [];
  for (let i = 0; i < s1.length; i++) {
    const l1 = s1[i];
    const l2 = s2[i];
    if (l1 !== l2) {
      numDiffChars += 1;
    } else {
      similarChars.push(l1);
    }
  }
  return { numDiffChars, similarChars };
}

function part1(lines: string[]) {
  let numTwoLetters = 0;
  let numThreeLetters = 0;
  for (const s of lines) {
    if (s === "") {
      continue;
    }
    const counter = countLetters(s);
    numTwoLetters += numLettersWithCount(counter, 2);
    numThreeLetters += numLettersWithCount(counter, 3);
  }
  const checksum = numTwoLetters * numThreeLetters;
  return checksum;
}

function part2(lines: string[]) {
  for (let i = 0; i < lines.length; i++) {
    const m1 = lines[i];
    for (let j = 0; j < lines.length; j++) {
      if (i === j) {
        continue;
      }
      const m2 = lines[j];
      const { numDiffChars, similarChars } = countNumDiffCharacters(m1, m2);
      if (numDiffChars === 1) {
        console.log(`Part 2 answer=${similarChars.join("")}`);
        return similarChars;
      }
    }
  }
  return [];
}

const inputFilepath = path.resolve(__dirname, "input");
fs.readFile(inputFilepath, "utf8", (err, data) => {
  if (err) {
    console.error(`${err}`);
    return;
  }
  const lines = data.split("\n");
  const checksum = part1(lines);
  console.log(`Checksum=${checksum}`);

  part2(lines);
});
