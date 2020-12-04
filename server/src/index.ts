import getPacketCarStatusData, {
  PacketCarStatusData
} from "./F12020-Telemetly/PacketCarStatusData";
import getPacketLapData, {
  PacketLapData
} from "./F12020-Telemetly/PacketLapData";
import getPacketParticipantsData, {
  PacketParticipantsData
} from "./F12020-Telemetly/PacketParticipantsData";
import { createTimeTableResponse } from "./F12020-Telemetly/response/TimeTable";
import express from "express";
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

server.on("listening", function () {
  const address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message: Buffer, remote: any) {
  if (message.byteLength == 1213) {
    participantsData = getPacketParticipantsData(message);
  } else if (message.byteLength == 1190) {
    lapData = getPacketLapData(message);
  } else if (message.byteLength == 1344) {
    carStatusData = getPacketCarStatusData(message);
  }
});

server.bind(PORT, HOST);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router: express.Router = express.Router();
router.get("/timesheet", (req: express.Request, res: express.Response) => {
  res.send(
    JSON.stringify({
      status: 200,
      timeTable: createTimeTableResponse(
        lapData,
        carStatusData,
        participantsData
      )
    })
  );
});

app.use(router);

// 3000番ポートでAPIサーバ起動
app.listen(3020, () => {
  console.log("Example app listening on port 3020!");
});
