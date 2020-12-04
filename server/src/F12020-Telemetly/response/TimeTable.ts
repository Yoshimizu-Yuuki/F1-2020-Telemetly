import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import { getTeamName, getDriverName } from "../common/common";

export default interface TimeTableResponse {
  teamName?: string; //チーム名
  carNumber?: number; //カーナンバー
  driverName?: string; //ドライバー名
  visualTyreCompound?: number; //履いているタイヤ
  currentLapNumber?: number; //現在走行中のラップ数
  carPosition?: number; //車のポジション
  sector1?: number; //セクター1 Time
  sector2?: number; //セクター2 Time
  distance?: number; //先頭との差
  lastLapTime?: number; //最後のラップタイム
  bestLapTime?: number; //べストラップ
}

// createTimeTableのレスポンスデータを作成する
export function createTimeTableResponse(
  lapData: PacketLapData | null,
  carStatusData: PacketCarStatusData | null,
  participantsData: PacketParticipantsData | null
): TimeTableResponse[] {
  return [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21
  ].map((el, index) => {
    return {
      teamName: participantsData
        ? getTeamName(parseInt(participantsData.m_participants[index].m_teamId.toString(),10))
        : undefined, //チーム名
      carNumber: participantsData
        ? parseInt(participantsData.m_participants[index].m_raceNumber.toString(),10)
        : undefined, //カーナンバー
      driverName: participantsData
        ? getDriverName(parseInt(participantsData.m_participants[index].m_driverId.toString(),10))
        : "", //ドライバー名
      visualTyreCompound: carStatusData
        ? parseInt(carStatusData.m_carStatusData[index].m_visualTyreCompound.toString(),10)
        : undefined, //履いているタイヤ
      currentLapNumber: lapData
        ? parseInt(lapData.m_lapData[index].m_currentLapNum.toString(),10)
        : undefined, //現在走行中のラップ数
      carPosition: lapData
        ? parseInt(lapData.m_lapData[index].m_carPosition.toString(),10)
        : undefined, //車のポジション
      sector1: lapData
        ? parseInt(lapData.m_lapData[index].m_sector1TimeInMS.toString(),10)
        : undefined, //セクター1 Time
      sector2: lapData
        ? parseInt(lapData.m_lapData[index].m_sector2TimeInMS.toString(),10)
        : undefined, //セクター2 Time
      distance: lapData
        ? parseFloat(lapData.m_lapData[index].m_totalDistance.toString())
        : 0, //先頭との差
      lastLapTime: lapData
        ? parseFloat(lapData.m_lapData[index].m_lastLapTime.toString())
        : undefined, //最後のラップタイム
      bestLapTime: lapData
        ? parseFloat(lapData.m_lapData[index].m_bestLapTime.toString())
        : undefined //べストラップ
    };
  }).filter((el:TimeTableResponse)=>{
    return el.carPosition !== 0
  }).sort((firstEl:TimeTableResponse,secondEl:TimeTableResponse):number=>{
    if(firstEl.carPosition && secondEl.carPosition)
      return firstEl.carPosition - secondEl.carPosition
    else
      return 0;
  });
}