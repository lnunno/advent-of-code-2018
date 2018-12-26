import * as fs from "fs";
import * as path from "path";

const inputFilepath = path.resolve(__dirname, 'input');
console.log(`${inputFilepath}`);
fs.readFile(inputFilepath, 'utf8', (err, data) => {
    if (err) {
        console.error(`${err}`);
        return;
    }
    const lines = data.split('\n');
    let sum = 0;
    for (const numLine of lines) {
        const num = Number(numLine);
        sum += num;
    }
    console.log(`Answer is ${sum}`);
});
