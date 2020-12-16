"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DeltaTime_1 = require("./F12020-Telemetly/common/DeltaTime");
const LapTime_1 = require("./F12020-Telemetly/common/LapTime");
const PacketCarStatusData_1 = __importDefault(require("./F12020-Telemetly/PacketCarStatusData"));
const PacketLapData_1 = __importDefault(require("./F12020-Telemetly/PacketLapData"));
const PacketParticipantsData_1 = __importDefault(require("./F12020-Telemetly/PacketParticipantsData"));
const PacketCarSetupData_1 = __importDefault(require("./F12020-Telemetly/PacketCarSetupData"));
const express_1 = __importDefault(require("express"));
const PacketCarTelemetryData_1 = __importDefault(require("./F12020-Telemetly/PacketCarTelemetryData"));
const PacketSessionData_1 = __importDefault(require("./F12020-Telemetly/PacketSessionData"));
const LiveTelemetry_1 = require("./F12020-Telemetly/response/LiveTelemetry");
const cors = require("cors");
const app = express_1.default();
var PORT = 22020;
var HOST = "127.0.0.1";
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
//グローバル変数を使う方法で見事にデータを取得成功。nodeのプロセス的には変数を共有しているっぽい。
let lapData = null;
let carStatusData = null;
let participantsData = null;
let carSetupData = null;
let carTelemetryData = null;
let sessionData = null;
let fastestIndex = 0;
let updateInterval;
let gamePaused;
server.on("listening", function () {
    const address = server.address();
    console.log("UDP Server listening on " + address.address + ":" + address.port);
});
server.on("message", function (message, remote) {
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
        const result = PacketSessionData_1.default(message);
        sessionData = result;
        if (sessionData && sessionData.m_gamePaused) {
            clearInterval(updateInterval);
            gamePaused = 1;
        }
        else if (gamePaused) {
            if (sessionData && parseInt(sessionData.m_gamePaused.toString()) === 0) {
                //更新を再開
                gamePaused = 0;
                updateInterval = setInterval(() => { LiveTelemetry_1.updateLiveTelemetryData(sessionData, lapData, carStatusData, participantsData, DeltaTime_1.getDeltaTime(), LapTime_1.getLapTime(), fastestIndex); }, 500);
            }
        }
    }
    else if (message.byteLength == 1307) {
        const result = PacketCarTelemetryData_1.default(message);
        carTelemetryData = result;
    }
    else if (message.byteLength == 1213) {
        const result = PacketParticipantsData_1.default(message);
        participantsData = result;
    }
    else if (message.byteLength == 1190) {
        const result = PacketLapData_1.default(message);
        lapData = result;
        if (lapData) {
            DeltaTime_1.updateDeltaTime(lapData);
            LapTime_1.updateLapTime(lapData);
        }
    }
    else if (message.byteLength == 1344) {
        const result = PacketCarStatusData_1.default(message);
        carStatusData = result;
    }
    else if (message.byteLength == 1102) {
        const result = PacketCarSetupData_1.default(message);
        carSetupData = result;
    }
    else if (message.byteLength == 35) {
        const result = String.fromCharCode(parseInt(message.readUInt8(24).toString()), parseInt(message.readUInt8(25).toString()), parseInt(message.readUInt8(26).toString()), parseInt(message.readUInt8(27).toString()));
        if (result === "SSTA") {
            console.log("セッション開始！");
            DeltaTime_1.initDeltaTime();
            LapTime_1.initLapTime();
            LiveTelemetry_1.initLiveTelemetryData(); //初期化しておきます。
            fastestIndex = 0;
            //保存を開始する。
            updateInterval = setInterval(() => { LiveTelemetry_1.updateLiveTelemetryData(sessionData, lapData, carStatusData, participantsData, DeltaTime_1.getDeltaTime(), LapTime_1.getLapTime(), fastestIndex); }, 500);
        }
        else if (result === "SEND") {
            //保存を終了する
            console.log("セッション終了！");
            clearInterval(updateInterval);
            //セーブする。
            LiveTelemetry_1.saveLiveTelemetryData();
        }
        else if ("FTLP") {
            //ファステストラップ。本当はここに書くべきものでは無さそうだが。
            fastestIndex = parseInt(message.readUInt8(28).toString(), 10);
        }
    }
});
server.bind(PORT, HOST);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors());
const router = express_1.default.Router();
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
router.get("/live", (req, res) => {
    res.send(JSON.stringify({
        status: 200,
        data: LiveTelemetry_1.createLiveTelemetryData()
    }));
});
app.use(router);
// 3000番ポートでAPIサーバ起動
app.listen(3020, () => {
    console.log("Example app listening on port 3020!");
});
