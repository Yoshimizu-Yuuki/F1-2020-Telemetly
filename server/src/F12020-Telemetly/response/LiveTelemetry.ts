import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import DeltaTime from "./../common/DeltaTime";
import LapTime from "../common/LapTime";
import TimeTableResponse, { createTimeTableResponse } from "./TimeTable";
import { PacketSessionData } from "../PacketSessionData";
import { writeFileSync } from "fs";

export default interface LiveTelemetryResponse {
    sessionTime?:number;     //添え字と一致するはず…
    safetiycar?:number;      //セーフティーカーかどうか
    timetable?:TimeTableResponse[];
}

let livedata:LiveTelemetryResponse[];

//livedataの初期化
export function initLiveTelemetryData(){
    livedata=[];
}

//livedataの更新
export function updateLiveTelemetryData(session:PacketSessionData|null,
    lapData: PacketLapData | null,
    carStatusData: PacketCarStatusData | null,
    participantsData: PacketParticipantsData | null,
    deltaTime: DeltaTime[],
    lapTime: LapTime[]){
    if(session){
        livedata[parseFloat(session.m_header.m_sessionTime.toString())] = {
            sessionTime:parseFloat(session.m_header.m_sessionTime.toString()),
            safetiycar:parseInt(session.m_safetyCarStatus.toString(),10),
            timetable:createTimeTableResponse(lapData,carStatusData,participantsData,deltaTime,lapTime),
        }
    }
}

//livedataの保存
export function saveLiveTelemetryData(){
    writeFileSync("/data/data.json",JSON.stringify(livedata));
}