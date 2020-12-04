import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import { PacketCarSetupData} from "./../PacketCarSetupData";
import { getTeamName, getDriverName } from "../common/common";

export default interface SettingTableResponse {
  teamName?: string; //チーム名
  carNumber?: number; //カーナンバー
  driverName?: string; //ドライバー名
  visualTyreCompound?: number; //履いているタイヤ
  currentLapNumber?: number; //現在走行中のラップ数
  carPosition?: number; //車のポジション
  lastLapTime?: number; //最後のラップタイム
  bestLapTime?: number; //べストラップ

  frontWing?:number;                // Front wing aero
  rearWing?:number;                 // Rear wing aero
  onThrottle?:number;               // Differential adjustment on throttle (percentage)
  offThrottle?:number;              // Differential adjustment off throttle (percentage)
  frontCamber?:number;              // Front camber angle (suspension geometry)
  rearCamber?:number;               // Rear camber angle (suspension geometry)
  frontToe?:number;                 // Front toe angle (suspension geometry)
  rearToe?:number;                  // Rear toe angle (suspension geometry)
  frontSuspension?:number;          // Front suspension
  rearSuspension?:number;           // Rear suspension
  frontAntiRollBar?:number;         // Front anti-roll bar
  rearAntiRollBar?:number;          // Front anti-roll bar
  frontSuspensionHeight?:number;    // Front ride height
  rearSuspensionHeight?:number;     // Rear ride height
  brakePressure?:number;            // Brake pressure (percentage)
  brakeBias?:number;                // Brake bias (percentage)
  rearLeftTyrePressure?:number;     // Rear left tyre pressure (PSI)
  rearRightTyrePressure?:number;    // Rear right tyre pressure (PSI)
  frontLeftTyrePressure?:number;    // Front left tyre pressure (PSI)
  frontRightTyrePressure?:number;   // Front right tyre pressure (PSI)
  ballast?:number;                  // Ballast
  fuelLoad?:number;                 // Fuel load
}


export function createSettingTableResponse(
    lapData: PacketLapData | null,
    carStatusData: PacketCarStatusData | null,
    participantsData: PacketParticipantsData | null,
    carSetupData:PacketCarSetupData|null
  ): SettingTableResponse[] {
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
      lastLapTime: lapData
        ? parseFloat(lapData.m_lapData[index].m_lastLapTime.toString())
        : undefined, //最後のラップタイム
      bestLapTime: lapData
        ? parseFloat(lapData.m_lapData[index].m_bestLapTime.toString())
        : undefined, //べストラップ
        frontWing:carSetupData?parseInt(carSetupData.m_carSetups[index].m_frontWing.toString(),10):undefined,
        rearWing:carSetupData?parseInt(carSetupData.m_carSetups[index].m_rearWing.toString(),10):undefined,
        onThrottle:carSetupData?parseInt(carSetupData.m_carSetups[index].m_onThrottle.toString(),10):undefined,
        offThrottle:carSetupData?parseInt(carSetupData.m_carSetups[index].m_offThrottle.toString(),10):undefined,
        frontCamber:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_frontCamber.toString()):undefined,
        rearCamber:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_rearCamber.toString()):undefined,
        frontToe:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_frontToe.toString()):undefined,
        rearToe:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_rearToe.toString()):undefined,
        frontSuspension:carSetupData?parseInt(carSetupData.m_carSetups[index].m_frontSuspension.toString(),10):undefined,
        rearSuspension:carSetupData?parseInt(carSetupData.m_carSetups[index].m_rearSuspension.toString(),10):undefined,
        frontAntiRollBar:carSetupData?parseInt(carSetupData.m_carSetups[index].m_frontAntiRollBar.toString(),10):undefined,
        rearAntiRollBar:carSetupData?parseInt(carSetupData.m_carSetups[index].m_rearAntiRollBar.toString(),10):undefined,
        frontSuspensionHeight:carSetupData?parseInt(carSetupData.m_carSetups[index].m_frontSuspensionHeight.toString(),10):undefined,
        rearSuspensionHeight:carSetupData?parseInt(carSetupData.m_carSetups[index].m_rearSuspensionHeight.toString(),10):undefined,
        brakePressure:carSetupData?parseInt(carSetupData.m_carSetups[index].m_brakePressure.toString(),10):undefined,
        brakeBias:carSetupData?parseInt(carSetupData.m_carSetups[index].m_brakeBias.toString(),10):undefined,
        rearLeftTyrePressure:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_rearLeftTyrePressure.toString()):undefined,
        rearRightTyrePressure:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_rearRightTyrePressure.toString()):undefined,
        frontLeftTyrePressure:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_rearLeftTyrePressure.toString()):undefined,
        frontRightTyrePressure:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_rearRightTyrePressure.toString()):undefined,
        ballast:carSetupData?parseInt(carSetupData.m_carSetups[index].m_ballast.toString(),10):undefined,
        fuelLoad:carSetupData?parseFloat(carSetupData.m_carSetups[index].m_fuelLoad.toString()):undefined,
      };
    }).filter((el:SettingTableResponse)=>{
      return el.carPosition !== 0
    }).sort((firstEl:SettingTableResponse,secondEl:SettingTableResponse):number=>{
      if(firstEl.carPosition && secondEl.carPosition)
        return firstEl.carPosition - secondEl.carPosition
      else
        return 0;
    });
  }