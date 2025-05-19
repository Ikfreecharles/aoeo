import { ScheduleFormatProps, ScheduleInterface } from "../types";

export const formatSchedule = (data: ScheduleFormatProps[]) => {
  return data.reduce((acc: ScheduleInterface[], current) => {
    return [
      ...acc,
      {
        index: parseInt(current.index),
        time: `${current.hour}:${current.minute}`,
      },
    ];
  }, []);
};
