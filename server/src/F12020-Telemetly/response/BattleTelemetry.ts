import { PacketLapData } from "./../PacketLapData";
import { PacketCarStatusData } from "./../PacketCarStatusData";
import { PacketParticipantsData } from "./../PacketParticipantsData";
import { getTeamName, getDriverName } from "../common/common";

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

  export function _createBattleTelemetryResponse(): BattleTelemetryResponse[] {
    return [0,1].map((el,index)=>{
        return {
            teamName:"dummy",
            carNumber: 99,
            driverName: "empty",
            visualTyreCompound: 16,
            tyresDamage:[15,16,17,18],
            tyresAgeLaps:5,
            currentLapNumber: 25,
            carPosition: index+4,
            distance: 2+index,
            lastLapTime: 90+index, //最後のラップタイム
            drsActivationDistance: index, //DRSが有効になるまでの距離
            drs:0, //DRSが有効かどうか
            speed:300+index,  //車速
            gear:7,   //ギア
            throttle:1.0,   //アクセル
            brake:0,  //ブレーキ
            ersStoreEnergy:1, //ERSの残量
            sessionFullLapNumber:50   //レースの周回数
          }
    })
  }