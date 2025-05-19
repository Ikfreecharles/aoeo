export interface ScheduleInterface {
  index: number;
  time: string;
  days?: [];
}

export interface ScheduleFormatProps {
  index: string;
  hour: string;
  minute: string;
}
