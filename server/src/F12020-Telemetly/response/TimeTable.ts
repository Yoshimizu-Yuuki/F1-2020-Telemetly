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
  currentLapTime?: number; //現在のラップタイム
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
        ? getTeamName(participantsData.m_participants[index].m_teamId[0])
        : undefined, //チーム名
      carNumber: participantsData
        ? participantsData.m_participants[index].m_raceNumber[0]
        : undefined, //カーナンバー
      driverName: participantsData
        ? getDriverName(participantsData.m_participants[index].m_driverId[0])
        : undefined, //ドライバー名
      visualTyreCompound: carStatusData
        ? carStatusData.m_carStatusData[index].m_visualTyreCompound[0]
        : undefined, //履いているタイヤ
      currentLapNumber: lapData
        ? lapData.m_lapData[index].m_currentLapNum[0]
        : undefined, //現在走行中のラップ数
      carPosition: lapData
        ? lapData.m_lapData[index].m_carPosition[0]
        : undefined, //車のポジション
      sector1: lapData
        ? lapData.m_lapData[index].m_sector1TimeInMS[0]
        : undefined, //セクター1 Time
      sector2: lapData
        ? lapData.m_lapData[index].m_sector2TimeInMS[0]
        : undefined, //セクター2 Time
      currentLapTime: lapData
        ? lapData.m_lapData[index].m_currentLapTime[0]
        : 0, //現在のラップタイム
      lastLapTime: lapData
        ? lapData.m_lapData[index].m_lastLapTime[0]
        : undefined, //最後のラップタイム
      bestLapTime: lapData
        ? lapData.m_lapData[index].m_bestLapTime[0]
        : undefined //べストラップ
    };
  });
}
