import {
  updateDeltaTime,
  getDeltaTime
} from "./F12020-Telemetly/common/DeltaTime";
import { updateLapTime, getLapTime } from "./F12020-Telemetly/common/LapTime";
import getPacketCarStatusData, {
  PacketCarStatusData
} from "./F12020-Telemetly/PacketCarStatusData";
import getPacketLapData, {
  PacketLapData
} from "./F12020-Telemetly/PacketLapData";
import getPacketParticipantsData, {
  PacketParticipantsData
} from "./F12020-Telemetly/PacketParticipantsData";
import getPacketCarSetupData, {
  PacketCarSetupData
} from "./F12020-Telemetly/PacketCarSetupData";
import { createTimeTableResponse } from "./F12020-Telemetly/response/TimeTable";
import { createSettingTableResponse } from "./F12020-Telemetly/response/SettingTable";
import { createBattleTelemetryResponse } from "./F12020-Telemetly/response/BattleTelemetry";
import express from "express";
import getPacketCarTelemetryData, {
  PacketCarTelemetryData
} from "./F12020-Telemetly/PacketCarTelemetryData";
import getPacketSessionData, {
  PacketSessionData
} from "./F12020-Telemetly/PacketSessionData";

const cors = require("cors");
const app: express.Express = express();

var PORT: Number = 22020;
var HOST: String = "127.0.0.1";

var dgram = require("dgram");
var server = dgram.createSocket("udp4");

//グローバル変数を使う方法で見事にデータを取得成功。nodeのプロセス的には変数を共有しているっぽい。
let lapData: PacketLapData | null = null;
let carStatusData: PacketCarStatusData | null = null;
let participantsData: PacketParticipantsData | null = null;
let carSetupData: PacketCarSetupData | null = null;
let carTelemetryData: PacketCarTelemetryData | null = null;
let sessionData: PacketSessionData | null = null;

server.on("listening", function () {
  const address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message: any, remote: any) {
  if (message.byteLength == 251) {
    const result = getPacketSessionData(message);
    sessionData = result;
  } else if (message.byteLength == 1307) {
    const result = getPacketCarTelemetryData(message);
    carTelemetryData = result;
  } else if (message.byteLength == 1213) {
    const result = getPacketParticipantsData(message);
    participantsData = result;
  } else if (message.byteLength == 1190) {
    const result = getPacketLapData(message);
    lapData = result;
    if (lapData) {
      updateDeltaTime(lapData);
      updateLapTime(lapData);
    }
  } else if (message.byteLength == 1344) {
    const result = getPacketCarStatusData(message);
    carStatusData = result;
  } else if (message.byteLength == 1102) {
    const result = getPacketCarSetupData(message);
    carSetupData = result;
  }
});

server.bind(PORT, HOST);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router: express.Router = express.Router();
router.get("/timetable", (req: express.Request, res: express.Response) => {
  res.send(
    JSON.stringify({
      status: 200,
      timetable: createTimeTableResponse(
        lapData,
        carStatusData,
        participantsData,
        getDeltaTime(),
        getLapTime()
      )
    })
  );
});

router.get("/settingtable", (req: express.Request, res: express.Response) => {
  res.send(
    JSON.stringify({
      status: 200,
      settingtable: createSettingTableResponse(
        lapData,
        carStatusData,
        participantsData,
        carSetupData
      )
    })
  );
});

router.get(
  "/battletelemetry",
  (req: express.Request, res: express.Response) => {
    res.send(
      JSON.stringify({
        status: 200,
        battletelemetry: createBattleTelemetryResponse(
          lapData,
          carStatusData,
          participantsData,
          carTelemetryData,
          sessionData,
          getDeltaTime()
        )
      })
    );
  }
);

app.use(router);

// 3000番ポートでAPIサーバ起動
app.listen(3020, () => {
  console.log("Example app listening on port 3020!");
});
