"use client";

import { DeleteOutline } from "@mui/icons-material";
import {
  SnackbarCloseReason,
  Box,
  Skeleton,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import mqtt from "mqtt";
import { COMMAND_SUB, OPTIONS, RESULT_SUB } from "mqttTypes";
import React, { useEffect, useState } from "react";
import { ScheduleInterface } from "types";
import { formatSchedule } from "utils/scheduleFormat";
import CloseIcon from "@mui/icons-material/Close";

const Dashboard = () => {
  const [start, setStart] = useState(false);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGetScheduleLoading, setIsGetScheduleLoading] =
    useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Array<ScheduleInterface>>([]);

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on("connect", () => {
        console.log("Connected");
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });
      client.on("reconnect", () => {
        console.log("Reconnecting");
      });
    } else {
      const clientConn = mqtt.connect("ws://localhost:8000/mqtt", {
        log: console.log.bind(console),
        keepalive: 30,
      });
      clientConn.on("connect", () => {
        console.log("connected");
        clientConn.publish(COMMAND_SUB.GET_SCHEDULE_COMMAND, OPTIONS.GET);
        setIsGetScheduleLoading(true);
        clientConn.subscribe(RESULT_SUB.START_RESULT, (err) => {
          if (!err) {
            console.log(`Subscribed to ${RESULT_SUB.START_RESULT}`);
          }
        });
        clientConn.subscribe(RESULT_SUB.ADD_SCHEDULE_RESULT, (err) => {
          if (!err) {
            console.log(`Subscribed to ${RESULT_SUB.ADD_SCHEDULE_RESULT}`);
          }
        });
        clientConn.subscribe(RESULT_SUB.GET_SCHEDULE_RESULT, (err) => {
          if (!err) {
            console.log(`Subscribed to ${RESULT_SUB.GET_SCHEDULE_RESULT}`);
          }
        });
        clientConn.subscribe(RESULT_SUB.DELETE_SCHEDULE_RESULT, (err) => {
          if (!err) {
            console.log(`Subscribed to ${RESULT_SUB.DELETE_SCHEDULE_RESULT}`);
          }
        });
        clientConn.subscribe(RESULT_SUB.ERROR, (err) => {
          if (!err) {
            console.log(`Subscribed to ${RESULT_SUB.ERROR}`);
          }
        });
        clientConn.subscribe(RESULT_SUB.DELETE_ALL_SCHEDULE_RESULT, (err) => {
          if (!err) {
            console.log(
              `Subscribed to ${RESULT_SUB.DELETE_ALL_SCHEDULE_RESULT}`
            );
          }
        });
      });
      setClient(clientConn);
    }
  }, [client]);

  useEffect(() => {
    if (client)
      client.on("message", (topic, message) => {
        if (topic === RESULT_SUB.START_RESULT) {
          const res = message.toString();
          setStart(() => res === OPTIONS.STOP && false);
          setStart(() => res === OPTIONS.START && true);
        } else if (topic === RESULT_SUB.GET_SCHEDULE_RESULT) {
          const res: string = message.toString();
          console.log(res);
          setSchedules(formatSchedule(JSON.parse(res)));
          setIsLoading(false);
          setIsGetScheduleLoading(false);
        } else if (topic === RESULT_SUB.ERROR) {
          setStatusMessage(message.toString());
          setOpenSnackbar(true);
        }
      });
  }, [client]);

  const handleScheduleChange = (
    idx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const timeSchedules = [...schedules];
    const schedule = { ...timeSchedules[idx] };
    schedule.time = event.target.value;
    schedule.index = idx;
    timeSchedules[idx] = schedule;
    setSchedules(timeSchedules);
  };

  const handleStartDispensation = () => {
    if (client?.connected) {
      client.publish(COMMAND_SUB.START_COMMAND, OPTIONS.START);
      setStart(true);
    } else {
      setStatusMessage("Client not connected");
      setOpenSnackbar(true);
    }
  };

  const handleStopDispensation = () => {
    if (client?.connected) {
      client.publish(COMMAND_SUB.START_COMMAND, OPTIONS.STOP);
      setStart(false);
    } else {
      setStatusMessage("Client not connected");
      setOpenSnackbar(true);
    }
  };

  const submitSchedule = (idx: number) => {
    if (client?.connected) {
      client.publish(
        COMMAND_SUB.ADD_SCHEDULE_COMMAND,
        `${schedules[idx].index}:${schedules[idx].time}`
      );
      console.log(`${schedules[idx].index}:${schedules[idx].time}`);

      setStatusMessage("Schedule added!");
      setOpenSnackbar(true);
    } else {
      setStatusMessage("Client not connected");
      setOpenSnackbar(true);
    }
  };

  const handleAddSchedule = () => {
    setSchedules((schedules) => [...schedules, { index: 0, time: "" }]);
  };

  const handleRemoveAllSchedule = () => {
    if (client?.connected) {
      client.publish(COMMAND_SUB.DELETE_SCHEDULE_COMMAND, ``);
      setSchedules([]);
    } else {
      setStatusMessage("Client not connected");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteSchedule = (idx: number) => {
    if (client?.connected) {
      client.publish(COMMAND_SUB.DELETE_SCHEDULE_COMMAND, `${idx}`);
      setIsLoading(true);
    } else {
      setStatusMessage("Client not connected");
      setOpenSnackbar(true);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleGetScheduleFromStorage = () => {
    if (client?.connected) {
      client.publish(COMMAND_SUB.GET_SCHEDULE_COMMAND, OPTIONS.GET);
    } else {
      setStatusMessage("Client not connected");
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="App">
      {start ? (
        <button onClick={handleStopDispensation}>STOP</button>
      ) : (
        <button onClick={handleStartDispensation}>START</button>
      )}
      <div>
        {isGetScheduleLoading ? (
          <Box sx={{ width: 200 }}>
            <Skeleton height={30} />
            <Skeleton animation="wave" height={30} />
            <Skeleton animation={false} height={30} />
          </Box>
        ) : (
          schedules.map((schedule, idx) => {
            return (
              <div key={idx}>
                <input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => handleScheduleChange(idx, e)}
                  onBlur={() => submitSchedule(idx)}
                />
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => handleDeleteSchedule(schedule.index)}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </div>
            );
          })
        )}
      </div>
      <div>
        {schedules.length < 5 && (
          <button onClick={handleAddSchedule}>
            <span>Add new schedule</span>
            {isLoading && <CircularProgress size="small" color="inherit" />}
          </button>
        )}
      </div>
      <div>
        <button onClick={handleRemoveAllSchedule}>Remove all schedule</button>
      </div>
      <div>
        <button onClick={handleGetScheduleFromStorage}>
          Get Schedule from storage
        </button>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message={statusMessage}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default Dashboard;
