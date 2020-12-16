import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import DeltaTime from "./../common/DeltaTime";
import LapTime from "../common/LapTime";
import TimeTableResponse, { createTimeTableResponse } from "./TimeTable";
import { PacketSessionData } from "../PacketSessionData";
import { existsSync, mkdir, mkdirSync, readFileSync, writeFileSync } from "fs";

export default interface LiveTelemetryResponse {
    sessionTime?:number;     //添え字と一致するはず…
    totalLap?:number;           //トータルラップ
    safetiycar?:number;      //セーフティーカーかどうか
    timetable?:TimeTableResponse[];
}

//保存用
let livedata:LiveTelemetryResponse[] = [];


//配信用
let responseData:Array<LiveTelemetryResponse> = existsSync("./data/data.json")?JSON.parse(readFileSync("./data/data.json").toString()):{};
let count:number = 0;

//livedataの初期化
export function initLiveTelemetryData(){
    livedata=[];
}


//livedataの更新
export function updateLiveTelemetryData(
    sessionData:PacketSessionData|null,
    lapData: PacketLapData | null,
    carStatusData: PacketCarStatusData | null,
    participantsData: PacketParticipantsData | null,
    deltaTime: DeltaTime[],
    lapTime: LapTime[],
    fastestIndex: number){
    if(sessionData){
        console.log(livedata.length);
        livedata.push({
            sessionTime:parseFloat(sessionData.m_header.m_sessionTime.toString()),
            totalLap:parseInt(sessionData.m_totalLaps.toString()),
            safetiycar:parseInt(sessionData.m_safetyCarStatus.toString(),10),
            timetable:createTimeTableResponse(lapData,carStatusData,participantsData,deltaTime,lapTime,fastestIndex),
        })
    }
}

//livedataの保存
export function saveLiveTelemetryData(){
    if(!existsSync("./data/")){
        mkdirSync("./data/");
    }
    writeFileSync("./data/data.json",JSON.stringify(livedata));
}

export function createLiveTelemetryData():LiveTelemetryResponse | null{
    if(responseData.length > count){
        let data = responseData[count];
        count++;
        return data;
    }else if(count &&(responseData.length == count)){
        return responseData[count-1];
    }
    return null;
}