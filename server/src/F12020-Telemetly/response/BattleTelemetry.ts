
import { getTeamName, getDriverName } from "../common/common";
import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import { PacketCarTelemetryData } from "../PacketCarTelemetryData";
import { PacketSessionData } from "./../PacketSessionData";
import DeltaTime from "./../common/DeltaTime";

export default interface BattleTelemetryResponse {
    teamName?: string; //チーム名
    carNumber?: number; //カーナンバー
    driverName?: string; //ドライバー名
    visualTyreCompound?: number; //履いているタイヤ
    tyresDamage?:number[];  //タイヤのダメージ
    tyresAgeLaps?:number;   //このタイヤでの周回数
    currentLapNumber?: number; //現在走行中のラップ数
    carPosition?: number; //車のポジション
    distance?: number; //先頭との差
    lastLapTime?: number; //最後のラップタイム
    drsActivationDistance?: number; //DRSが有効になるまでの距離
    drs?:number; //DRSが有効かどうか
    speed?:number;  //車速
    gear?:number;   //ギア
    throttle?:number;   //アクセル
    brake?:number;  //ブレーキ
    ersStoreEnergy?:number; //ERSの残量
    sessionFullLapNumber?:number;   //レースの周回数
  }

export function createBattleTelemetryResponse(
    lapData: PacketLapData | null,
    carStatusData: PacketCarStatusData | null,
    participantsData: PacketParticipantsData | null,
    carTelemetryData:PacketCarTelemetryData|null,
    sessionData:PacketSessionData|null,
    deltaTime:DeltaTime[]
  ): BattleTelemetryResponse[] {

    /*
    ・それぞれのマシンはtotalDistanceが、前回よりも50m進んだか確認。totalDistance>=count*50
    ・進んでいたら、count++する。次回のフレームでtotalDistance>=count*50を確認するため。
    ・進んでいたら、現在のセッションdurationを添え字countに保存する。
     */

    const playerIndex = carTelemetryData?parseInt(carTelemetryData.m_header.m_playerCarIndex.toString(),10):0;
    const playerCarPosition = lapData?parseInt(lapData.m_lapData[playerIndex].m_carPosition.toString(),10):0;
    const data:BattleTelemetryResponse[] = [
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
    ].map((el,index)=>{
      const deltaTimeItem = deltaTime.find((el)=>{
        return el.carPosition == (lapData?parseInt(lapData.m_lapData[index].m_carPosition.toString(),10):undefined)
      });
      const distance = deltaTimeItem?deltaTimeItem.lastTimeDuration: undefined;
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
            tyresDamage:carStatusData
            ? carStatusData.m_carStatusData[index].m_tyresDamage.map((el)=>{return parseInt(el.toString(),10)})
            : undefined,
            tyresAgeLaps:carStatusData
            ? parseInt(carStatusData.m_carStatusData[index].m_tyresAgeLaps.toString(),10)
            : undefined,
            currentLapNumber: lapData
            ? parseInt(lapData.m_lapData[index].m_currentLapNum.toString(),10)
            : undefined, //現在走行中のラップ数
            carPosition: lapData
            ? parseInt(lapData.m_lapData[index].m_carPosition.toString(),10)
            : undefined, //車のポジション
            distance,
            lastLapTime: lapData
            ? parseFloat(lapData.m_lapData[index].m_lastLapTime.toString())
            : undefined, //最後のラップタイム
            drsActivationDistance: carStatusData
            ? parseFloat(carStatusData.m_carStatusData[index].m_drsActivationDistance.toString())
            : undefined,
            drs:carTelemetryData
            ? parseInt(carTelemetryData.m_carTelemetryData[index].m_drs.toString(),10)
            : undefined,
            speed:carTelemetryData
            ? parseInt(carTelemetryData.m_carTelemetryData[index].m_speed.toString(),10)
            : undefined,
            gear:carTelemetryData
            ? parseInt(carTelemetryData.m_carTelemetryData[index].m_gear.toString(),10)
            : undefined,
            throttle:carTelemetryData
            ? parseFloat(carTelemetryData.m_carTelemetryData[index].m_throttle.toString())
            : undefined,
            brake:carTelemetryData
            ? parseFloat(carTelemetryData.m_carTelemetryData[index].m_brake.toString())
            : undefined,
            ersStoreEnergy:carStatusData
            ? parseFloat(carStatusData.m_carStatusData[index].m_ersStoreEnergy.toString())
            : undefined,
            sessionFullLapNumber:sessionData
            ? parseInt(sessionData.m_totalLaps.toString(),10)
            : undefined,
          }
    }).filter((el:BattleTelemetryResponse)=>{
      if(playerCarPosition==1 && el.carPosition == 2){
        return true;
      }else if(playerCarPosition == el.carPosition){
        return true;
      }else if(playerCarPosition-1 == el.carPosition){
        return true;
      }else if(playerCarPosition + 1 == el.carPosition){
        return true;
      }
      return false;
    }).sort((firstEl:BattleTelemetryResponse,secondEl:BattleTelemetryResponse):number=>{
      if(firstEl.carPosition && secondEl.carPosition)
        return firstEl.carPosition - secondEl.carPosition
      else
        return 0;
    });

    if(data.length==3 &&data[0].distance&&data[1].distance&&data[2].distance){
      if(data[1].distance<data[2].distance){
        return data.slice(0,2);
      }else{
        return data.slice(1,3);
      }
    }

    return data;
  }