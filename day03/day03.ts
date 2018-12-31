import * as fs from "fs";
import * as path from "path";

function prettyPrintArray(a: number[][]) {
  for (let i = 0; i < a.length; i++) {
    const row = a[i];
    for (let j = 0; j < row.length; j++) {
      const item = row[j];
      if (item === OVERLAP_VALUE) {
        process.stdout.write("X");
      } else if (item) {
        process.stdout.write(`${item}`);
      } else {
        process.stdout.write(".");
      }
    }
    process.stdout.write("\n");
  }
  console.log(`\n`);
}

type Fabric = number[][];

interface Claim {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Context {
  nonOverlappingIds: Set<number>;
}

const OVERLAP_VALUE = -99999999999;
function claimFabric(claim: Claim, fabric: Fabric, context: Context) {
  const { id, left, top, width, height } = claim;
  context.nonOverlappingIds.add(id);
  for (let i = top; i < top + height; i++) {
    for (let j = left; j < left + width; j++) {
      if (fabric[i][j] !== undefined) {
        context.nonOverlappingIds.delete(id);
        context.nonOverlappingIds.delete(fabric[i][j]);
        fabric[i][j] = OVERLAP_VALUE;
      } else {
        fabric[i][j] = id;
      }
    }
  }
}

function countOverlaps(fabric: Fabric) {
  let numOverlaps = 0;
  for (let i = 0; i < fabric.length; i++) {
    const row = fabric[i];
    for (let j = 0; j < row.length; j++) {
      const element = row[j];
      if (element === OVERLAP_VALUE) {
        numOverlaps += 1;
      }
    }
  }
  return numOverlaps;
}

const N = 1000;
const lineRegex = /#(\d+)\W+@\W+(\d+),(\d+):\W+(\d+)x(\d+)/;
function part1(lines: string[]) {
  const fabric = Array.from(Array(N), () => new Array(N));
  const context: Context = {
    nonOverlappingIds: new Set()
  };
  for (const s of lines) {
    if (s === "") {
      continue;
    }
    const match = s.match(lineRegex);
    if (match) {
      const [_, id, left, top, width, height] = match;
      const claim = {
        id: Number(id),
        left: Number(left),
        top: Number(top),
        width: Number(width),
        height: Number(height)
      };
      claimFabric(claim, fabric, context);
      // prettyPrintArray(fabric);
    }
  }
  const numOverlaps = countOverlaps(fabric);
  console.log(`Part 1=${numOverlaps}`);
  console.log(`${context.nonOverlappingIds}`);
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
