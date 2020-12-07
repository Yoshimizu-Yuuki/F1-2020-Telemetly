import { PacketLapData } from "../PacketLapData";

export default interface LapTime {
  carPosition: number;
  showLapTime: OneLapTime;
}

interface OneLapTime {
  sector1: number;
  sector2: number;
  sector3: number;
  laptime: number;
}

let lapTimeData = [
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
].map(
  (el): LapTime => {
    return {
      carPosition: 0,
      showLapTime: { sector1: 0, sector2: 0, sector3: 0, laptime: 0 }
    };
  }
);

export function updateLapTime(carLapData: PacketLapData) {
  carLapData.m_lapData.forEach((el, index) => {
    //ポジションを添え字にしたいので、更新。
    lapTimeData[index].carPosition = parseInt(el.m_carPosition.toString(), 10);

    //現在のsector
    const sector = parseInt(el.m_sector.toString(), 10); //現在のsector
    const lastLapTime = parseFloat(el.m_lastLapTime.toString()); //lastlap

    if (sector == 0) {
      //表示用データ
      lapTimeData[index].showLapTime = {
        sector1: parseInt(el.m_sector1TimeInMS.toString(), 10),
        sector2: parseInt(el.m_sector2TimeInMS.toString(), 10),
        sector3:
          lastLapTime -
          lapTimeData[index].showLapTime.sector1 -
          lapTimeData[index].showLapTime.sector2,
        laptime: lastLapTime
      };
    } else if (sector == 1) {
      //表示用データ
      lapTimeData[index].showLapTime = {
        sector1: parseInt(el.m_sector1TimeInMS.toString(), 10),
        sector2: 0,
        sector3: 0,
        laptime: lastLapTime
      };
    } else if (sector == 2) {
      //表示用データ
      lapTimeData[index].showLapTime = {
        sector1: parseInt(el.m_sector1TimeInMS.toString(), 10),
        sector2: parseInt(el.m_sector2TimeInMS.toString(), 10),
        sector3: 0,
        laptime: lastLapTime
      };
    }
    /*
        現在のsectornum 0
        lastlap
        前週の1,2,3を表示
        laptime=lastlaptime
        前週のS3=lastlaptime - 前週のsector1 - 前週のsector2

        1の場合
        lastlap
        今週の1を表示

        2の場合
        lastlap
        今週の1,2を表示
    */
  });
}

export function getLapTime() {
  //不正なポジションは削除と、ポジション順に並び替え。
  let sortedLapTime = lapTimeData;
  sortedLapTime = sortedLapTime
    .filter((el) => {
      return el.carPosition;
    })
    .sort((firstEl: LapTime, secondEl: LapTime) => {
      return firstEl.carPosition - secondEl.carPosition;
    });
  return sortedLapTime;
}
