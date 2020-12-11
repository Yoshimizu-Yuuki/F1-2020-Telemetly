import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import { getTeamName, getDriverName, getTyreName } from "../common/common";
import DeltaTime from "./../common/DeltaTime";
import LapTime from "../common/LapTime";

export default interface TimeTableResponse {
  teamName?: string; //チーム名
  carNumber?: number; //カーナンバー
  driverName?: string; //ドライバー名
  visualTyreCompound?: string; //履いているタイヤ
  currentLapNumber?: number; //現在走行中のラップ数
  carPosition?: number; //車のポジション
  sector1?: number; //セクター1 Time
  sector2?: number; //セクター2 Time
  sector3?: number; //セクター3 Time
  distance?: number; //先頭との差
  lastLapTime?: number; //最後のラップタイム
  bestLapTime?: number; //べストラップ
  isFastest?:boolean; //ファステストラップ
}

// createTimeTableのレスポンスデータを作成する
export function createTimeTableResponse(
  lapData: PacketLapData | null,
  carStatusData: PacketCarStatusData | null,
  participantsData: PacketParticipantsData | null,
  deltaTime: DeltaTime[],
  lapTime: LapTime[],
  fastestIndex:number = -1
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
  ]
    .map((el, index) => {
      const deltaTimeItem = deltaTime.find((el) => {
        return (
          el.carPosition ==
          (lapData
            ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
            : undefined)
        );
      });
      const distance = deltaTimeItem
        ? deltaTimeItem.lastTimeDuration
        : undefined;

      const lapTimeItem = lapTime.find((el) => {
        return (
          el.carPosition ==
          (lapData
            ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
            : undefined)
        );
      });
      const sector1 = lapTimeItem
        ? lapTimeItem.showLapTime.sector1
          ? lapTimeItem.showLapTime.sector1
          : undefined
        : undefined;

      const sector2 = lapTimeItem
        ? lapTimeItem.showLapTime.sector2
          ? lapTimeItem.showLapTime.sector2
          : undefined
        : undefined;

      const sector3 = lapTimeItem
        ? lapTimeItem.showLapTime.sector3
          ? lapTimeItem.showLapTime.sector3
          : undefined
        : undefined;

      const lastLapTime = lapTimeItem
        ? lapTimeItem.showLapTime.laptime
          ? lapTimeItem.showLapTime.laptime
          : undefined
        : undefined;

      return {
        teamName: participantsData
          ? getTeamName(
              parseInt(
                participantsData.m_participants[index].m_teamId.toString(),
                10
              )
            )
          : undefined, //チーム名
        carNumber: participantsData
          ? parseInt(
              participantsData.m_participants[index].m_raceNumber.toString(),
              10
            )
          : undefined, //カーナンバー
        driverName: participantsData
          ? getDriverName(
              parseInt(
                participantsData.m_participants[index].m_driverId.toString(),
                10
              )
            )
          : "", //ドライバー名
        visualTyreCompound: carStatusData
          ? getTyreName(
              parseInt(
                carStatusData.m_carStatusData[
                  index
                ].m_visualTyreCompound.toString(),
                10
              )
            )
          : undefined, //履いているタイヤ
        currentLapNumber: lapData
          ? parseInt(lapData.m_lapData[index].m_currentLapNum.toString(), 10)
          : undefined, //現在走行中のラップ数
        carPosition: lapData
          ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
          : undefined, //車のポジション
        sector1, //セクター1 Time
        sector2, //セクター2 Time
        sector3, //セクター3 Time
        distance,
        lastLapTime, //最後のラップタイム
        bestLapTime: lapData
          ? parseFloat(lapData.m_lapData[index].m_bestLapTime.toString())
          : undefined, //べストラップ
        isFastest:(index === fastestIndex)
      };
    })
    .filter((el: TimeTableResponse) => {
      return el.carPosition !== 0;
    })
    .sort((firstEl: TimeTableResponse, secondEl: TimeTableResponse): number => {
      if (firstEl.carPosition && secondEl.carPosition)
        return firstEl.carPosition - secondEl.carPosition;
      else return 0;
    });
}
