export enum COMMAND_SUB {
  START_COMMAND = "command/start",
  PAUSE_COMMAND = "command/pause",
  ADD_SCHEDULE_COMMAND = "command/schedule/add",
  DELETE_SCHEDULE_COMMAND = "command/schedule/delete",
  PUT_SCHEDULE_COMMAND = "command/schedule/put",
  GET_SCHEDULE_COMMAND = "command/schedule/get",
  DELETE_ALL_SCHEDULE_COMMAND = "command/schedule/deleteAll",
}

export enum RESULT_SUB {
  START_RESULT = "result/start",
  PAUSE_RESULT = "result/pause",
  SCHEDULE_RESULT = "result/schedule",
  ADD_SCHEDULE_RESULT = "result/schedule/add",
  GET_SCHEDULE_RESULT = "result/schedule/get",
  DELETE_SCHEDULE_RESULT = "result/schedule/delete",
  PUT_SCHEDULE_RESULT = "result/schedule/put",
  DELETE_ALL_SCHEDULE_RESULT = "result/schedule/deleteAll",
  ERROR = "result/error",
}

export enum OPTIONS {
  STOP = "0",
  START = "1",
  GET = "2",
}
