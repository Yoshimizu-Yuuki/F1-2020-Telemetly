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
const TimeTable_1 = require("./F12020-Telemetly/response/TimeTable");
const SettingTable_1 = require("./F12020-Telemetly/response/SettingTable");
const BattleTelemetry_1 = require("./F12020-Telemetly/response/BattleTelemetry");
const express_1 = __importDefault(require("express"));
const PacketCarTelemetryData_1 = __importDefault(require("./F12020-Telemetly/PacketCarTelemetryData"));
const PacketSessionData_1 = __importDefault(require("./F12020-Telemetly/PacketSessionData"));
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
server.on("listening", function () {
    const address = server.address();
    console.log("UDP Server listening on " + address.address + ":" + address.port);
});
server.on("message", function (message, remote) {


    if (message.byteLength == 251) {
        const result = PacketSessionData_1.default(message);
        sessionData = result;
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
    //カーステータースデータ。タイヤとか
    else if (message.byteLength == 1344) {
        const result = PacketCarStatusData_1.default(message);
        carStatusData = result;
    }
    else if (message.byteLength == 1102) {
        const result = PacketCarSetupData_1.default(message);
        carSetupData = result;
    }
});
server.bind(PORT, HOST);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors());
const router = express_1.default.Router();
router.get("/timetable", (req, res) => {
    res.send(JSON.stringify({
        status: 200,
        timetable: TimeTable_1.createTimeTableResponse(lapData, carStatusData, participantsData, DeltaTime_1.getDeltaTime(), LapTime_1.getLapTime())
    }));
});
router.get("/settingtable", (req, res) => {
    res.send(JSON.stringify({
        status: 200,
        settingtable: SettingTable_1.createSettingTableResponse(lapData, carStatusData, participantsData, carSetupData)
    }));
});
router.get("/battletelemetry", (req, res) => {
    res.send(JSON.stringify({
        status: 200,
        battletelemetry: BattleTelemetry_1.createBattleTelemetryResponse(lapData, carStatusData, participantsData, carTelemetryData, sessionData, DeltaTime_1.getDeltaTime())
    }));
});
app.use(router);
// 3000番ポートでAPIサーバ起動
app.listen(3020, () => {
    console.log("Example app listening on port 3020!");
});
