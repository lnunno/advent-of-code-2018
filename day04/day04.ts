import * as fs from "fs";
import * as path from "path";
import * as moment from "moment";
import * as _ from "lodash";

enum Action {
  FALLS_ASLEEP = "FALLS_ASLEEP",
  WAKES_UP = "WAKES_UP",
  BEGINS_SHIFT = "BEGINS_SHIFT"
}

function actionFromString(s: string): Action {
  if (s === "falls asleep") {
    return Action.FALLS_ASLEEP;
  } else if (s === "wakes up") {
    return Action.WAKES_UP;
  } else if (s.startsWith("Guard")) {
    return Action.BEGINS_SHIFT;
  } else {
    throw new Error(`No action type from: "${s}"`);
  }
}

interface Event {
  time: moment.Moment;
  action: Action;
  guardNumber?: number;
}

interface MinuteEntry {
  minuteNumber: number;
  count: number;
}
interface Guard {
  id: number;
  minutesAsleep: number[];
  longestSleptMinute?: MinuteEntry;
}

function getMaximumSleptMinute(guard: Guard): MinuteEntry | undefined {
  const result = _.maxBy(_.entries(_.countBy(guard.minutesAsleep)), "[1]");
  if (result === undefined) {
    return undefined;
  }
  return {
    minuteNumber: Number(result[0]),
    count: Number(result[1])
  };
}

const lineRegex = /\[([\d\- :]+)\] (falls asleep|wakes up|Guard #(\d+) begins shift)/;
function solution(lines: string[]) {
  const events: Event[] = [];
  for (const s of lines) {
    if (s === "") {
      continue;
    }
    const match = s.match(lineRegex);
    if (match) {
      const [_, datetimeString, actionString, guardNumberString] = match;
      const time = moment(datetimeString);
      const action = actionFromString(actionString);
      let guardNumber;
      if (guardNumberString) {
        guardNumber = Number(guardNumberString);
      }
      const event: Event = {
        time,
        action,
        guardNumber
      };
      events.push(event);
    } else {
      throw new Error(`No match for line: "${s}"`);
    }
  }
  events.sort((a, b) => {
    if (a.time < b.time) {
      return -1;
    } else if (b.time < a.time) {
      return 1;
    } else {
      return 0;
    }
  });
  let currentId;
  let lastSleepTime: moment.Moment | undefined = undefined;
  const guards: Map<number, Guard> = new Map();
  for (const event of events) {
    switch (event.action) {
      case Action.BEGINS_SHIFT: {
        if (event.guardNumber === undefined) {
          throw new Error(`No guard number for BEGIN_SHIFT event!`);
        }
        currentId = event.guardNumber;
        if (!guards.has(currentId)) {
          guards.set(currentId, { id: currentId, minutesAsleep: [] });
        }
        break;
      }
      case Action.FALLS_ASLEEP: {
        if (currentId === undefined) {
          throw new Error(`No guard number for FALLS_ASLEEP event!`);
        }
        const guard = guards.get(currentId);
        if (guard === undefined) {
          throw new Error(`Can't find guard in guard map.`);
        }
        guard.minutesAsleep.push(event.time.minute());
        lastSleepTime = event.time;
        break;
      }
      case Action.WAKES_UP: {
        if (currentId === undefined) {
          throw new Error(`No guard number for WAKES_UP event!`);
        }
        const guard = guards.get(currentId);
        if (guard === undefined) {
          throw new Error(`Can't find guard in guard map.`);
        }
        let m = moment(lastSleepTime);
        m.add(1, "minutes");
        for (; m.isBefore(event.time); m.add(1, "minutes")) {
          guard.minutesAsleep.push(m.minute());
        }
        break;
      }
      default: {
        throw new Error(`No matching action ${event.action}`);
      }
    }
  }
  let longestSleepingGuard: Guard | undefined;
  const method: string = "2";
  for (const guard of guards.values()) {
    if (method === "1") {
      if (
        longestSleepingGuard === undefined ||
        guard.minutesAsleep.length > longestSleepingGuard.minutesAsleep.length
      ) {
        longestSleepingGuard = guard;
      }
    } else if (method === "2") {
      const longestSleptMinute = getMaximumSleptMinute(guard);
      guard.longestSleptMinute = longestSleptMinute;
      if (
        longestSleepingGuard === undefined ||
        (longestSleepingGuard.longestSleptMinute === undefined ||
          (guard.longestSleptMinute !== undefined &&
            longestSleepingGuard.longestSleptMinute.count <
              guard.longestSleptMinute.count))
      ) {
        longestSleepingGuard = guard;
      }
    }
  }
  if (longestSleepingGuard === undefined) {
    throw new Error("Can't find longest sleeping guard.");
  }
  if (method === "1") {
    const maxMinute = getMaximumSleptMinute(longestSleepingGuard);
    if (maxMinute === undefined) {
      throw new Error(`Could not determine an answer for Part 1`);
    }
    const { minuteNumber } = maxMinute;
    console.log(`Part 1=${longestSleepingGuard.id * minuteNumber}`);
  } else if (method === "2") {
    console.log(
      `Part 2=${longestSleepingGuard.id *
        longestSleepingGuard.longestSleptMinute!.minuteNumber}`
    );
  }
}

const inputFilepath = path.resolve(__dirname, "input");
fs.readFile(inputFilepath, "utf8", (err, data) => {
  if (err) {
    console.error(`${err}`);
    return;
  }
  const lines = data.split("\n");
  console.time("Part 1");
  solution(lines);
  console.timeEnd("Part 1");
});
