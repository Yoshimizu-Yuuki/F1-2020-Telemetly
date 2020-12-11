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
import { createLiveTelemetryData, initLiveTelemetryData, saveLiveTelemetryData, updateLiveTelemetryData } from "./F12020-Telemetly/response/LiveTelemetry";

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
let fastestIndex = 0;

let updateInterval:NodeJS.Timeout;
let gamePaused:number;

server.on("listening", function () {
  const address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message: Buffer, remote: any) {
      /*
    1フレーム目で初期化が可能なもの。
    Session 2per second
    Participants 5per second
    Car Setups 2per Second（いらない？）
    Lap Data Rate as specified in menus
    Motion Data いらない？
    Car Telemetry Rate as specified in menus
    Car Status Rate as specified in menus
    PacketEventData m_eventStringCode=="SSTA" = セッション開始のタイミング=このイベントを受信したタイミングから、一定タイミング0.5秒ごとにデータ保存を行えばよいと思われる。 “SEND”=これでデータ保存の終了を行っても良さそう。
    PacketFinalClassificationData Once at the end of a race = レース終了時に送られるイベント。このパケットを受信したタイミングでデータ保存を終了すればよいと思われる？一旦SSENDでデータを取るのを終了させたい。

    //セッションがポーズされている場合は保存を一旦停止した方がよい session.m_gamePaused=1なら一時停止されている。
    //パケットを保存する際はセッションタイムも一緒に保存する。最後に読み込んだセッションタイムが、現在のセッションタイムよりも早ければ、そのセッションタイム以上のデータは削除する。

    [id:最後のセッションタイム]=を保存すればいけそう。idがそれ以上のものは削除するみたいな感じ。
    データを最後に保存する時に成形する。

    */
    //セッションデータ
  if (message.byteLength == 251) {
    const result = getPacketSessionData(message);
    sessionData = result;

    if(sessionData && sessionData.m_gamePaused){
      clearInterval(updateInterval);
      gamePaused = 1;
    }else if(gamePaused){
      if(sessionData&&parseInt(sessionData.m_gamePaused.toString()) === 0){
        //更新を再開
        gamePaused = 0;
        updateInterval = setInterval(()=>{updateLiveTelemetryData(sessionData,lapData,carStatusData,participantsData,getDeltaTime(),getLapTime(),fastestIndex)},500);
      } 
    }
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
  }else if(message.byteLength == 35){
    const result = String.fromCharCode(parseInt(message.readUInt8(24).toString()),parseInt(message.readUInt8(25).toString()),parseInt(message.readUInt8(26).toString()),parseInt(message.readUInt8(27).toString()));
    if(result === "SSTA"){
      console.log("セッション開始！");
      initLiveTelemetryData();//初期化しておきます。
      fastestIndex=0;
      //保存を開始する。
      updateInterval = setInterval(()=>{updateLiveTelemetryData(sessionData,lapData,carStatusData,participantsData,getDeltaTime(),getLapTime(),fastestIndex)},500);
    }else if(result === "SEND"){
      //保存を終了する
      console.log("セッション終了！");
      clearInterval(updateInterval);
      //セーブする。
      saveLiveTelemetryData();
    }else if("FTLP"){
      //ファステストラップ。本当はここに書くべきものでは無さそうだが。
      fastestIndex = parseInt(message.readUInt8(28).toString(),10);
    }
  }
});

server.bind(PORT, HOST);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router: express.Router = express.Router();
// router.get("/timetable", (req: express.Request, res: express.Response) => {
//   res.send(
//     JSON.stringify({
//       status: 200,
//       timetable: createTimeTableResponse(
//         lapData,
//         carStatusData,
//         participantsData,
//         getDeltaTime(),
//         getLapTime()
//       )
//     })
//   );
// });

// router.get("/settingtable", (req: express.Request, res: express.Response) => {
//   res.send(
//     JSON.stringify({
//       status: 200,
//       settingtable: createSettingTableResponse(
//         lapData,
//         carStatusData,
//         participantsData,
//         carSetupData
//       )
//     })
//   );
// });

// router.get(
//   "/battletelemetry",
//   (req: express.Request, res: express.Response) => {
//     res.send(
//       JSON.stringify({
//         status: 200,
//         battletelemetry: createBattleTelemetryResponse(
//           lapData,
//           carStatusData,
//           participantsData,
//           carTelemetryData,
//           sessionData,
//           getDeltaTime()
//         )
//       })
//     );
//   }
// );

router.get("/live", (req: express.Request, res: express.Response) => {
  res.send(
    JSON.stringify({
      status: 200,
      data: createLiveTelemetryData()
    })
  );
});

app.use(router);

// 3000番ポートでAPIサーバ起動
app.listen(3020, () => {
  console.log("Example app listening on port 3020!");
});
