"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLiveTelemetryData = exports.saveLiveTelemetryData = exports.updateLiveTelemetryData = exports.initLiveTelemetryData = void 0;
const TimeTable_1 = require("./TimeTable");
const fs_1 = require("fs");
//保存用
let livedata = [];
//配信用
let responseData = fs_1.existsSync("./data/data.json") ? JSON.parse(fs_1.readFileSync("./data/data.json").toString()) : {};
let count = 0;
//livedataの初期化
function initLiveTelemetryData() {
    livedata = [];
}
exports.initLiveTelemetryData = initLiveTelemetryData;
//livedataの更新
function updateLiveTelemetryData(sessionData, lapData, carStatusData, participantsData, deltaTime, lapTime, fastestIndex) {
    if (sessionData) {
        console.log(livedata.length);
        livedata.push({
            sessionTime: parseFloat(sessionData.m_header.m_sessionTime.toString()),
            totalLap: parseInt(sessionData.m_totalLaps.toString()),
            safetiycar: parseInt(sessionData.m_safetyCarStatus.toString(), 10),
            timetable: TimeTable_1.createTimeTableResponse(lapData, carStatusData, participantsData, deltaTime, lapTime, fastestIndex),
        });
    }
}
exports.updateLiveTelemetryData = updateLiveTelemetryData;
//livedataの保存
function saveLiveTelemetryData() {
    if (!fs_1.existsSync("./data/")) {
        fs_1.mkdirSync("./data/");
    }
    console.log(livedata.length);
    fs_1.writeFileSync("./data/data.json", JSON.stringify(livedata));
}
exports.saveLiveTelemetryData = saveLiveTelemetryData;
function createLiveTelemetryData() {
    if (responseData.length > count) {
        let data = responseData[count];
        count++;
        return data;
    }
    else if (count && (responseData.length == count)) {
        return responseData[count - 1];
    }
    return null;
}
exports.createLiveTelemetryData = createLiveTelemetryData;
