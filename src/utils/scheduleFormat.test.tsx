import { ScheduleFormatProps } from "../types";
import { formatSchedule } from "./scheduleFormat";

const data: ScheduleFormatProps[] = [
  { index: "0", hour: "10", minute: "26" },
  { index: "1", hour: "14", minute: "35" },
  { index: "2", hour: "08", minute: "17" },
];
const result = [
  { index: 0, time: "10:26" },
  { index: 1, time: "14:35" },
  { index: 2, time: "08:17" },
];
describe("Schedule formatter", () => {
  test("should return formatted object", () => {
    const formattedObject = formatSchedule(data);
    expect(formattedObject).toEqual(result);
  });
});
