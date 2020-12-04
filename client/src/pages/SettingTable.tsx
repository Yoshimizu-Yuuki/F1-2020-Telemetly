import React, { useEffect, useState } from "react";
import SettingTableResponse from "./../../../server/src/F12020-Telemetly/response/SettingTable";
import "./SettingTable.scss";

function SettingTable() {
  let init: Array<SettingTableResponse> = [{}];
  const [settingTableData, setSettingTableData] = useState(init);

  useEffect(() => {
    // Update the document title using the browser API
    const instance = setInterval(() => {
      fetch("http://127.0.0.1:3020/settingtable", {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setSettingTableData(data.settingtable);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, 2000);

    return () => {
      clearInterval(instance);
    };
  });

  return (
    <div className='container'>
      <table className='settingtable'>
        <thead className='settingtable-header'>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>Car No</th>
            <th>Driver</th>
            <th>Tyre</th>
            <th>Lap</th>
            <th>LastLap</th>
            <th>BestLap</th>
            <th>Fウィング</th>
            <th>Rウィング</th>
            <th>デフ・オンスロットル</th>
            <th>デフ・オフスロットル</th>
            <th>Fキャンバー</th>
            <th>Rキャンバー</th>
            <th>Fトー角</th>
            <th>Rトー角</th>
            <th>Fサスペンション</th>
            <th>Rサスペンション</th>
            <th>Fアンチロールバー</th>
            <th>Rアンチロールバー</th>
            <th>Fサスペンション高</th>
            <th>Rサスペンション高</th>
            <th>ブレーキ圧</th>
            <th>バイアス比</th>
            <th>RL空気圧</th>
            <th>RR空気圧</th>
            <th>FL空気圧</th>
            <th>FR空気圧</th>
            <th>バラスト</th>
            <th>燃料</th>
          </tr>
        </thead>
        <tbody className='settingtable-body'>
          {settingTableData.map((el: SettingTableResponse) => {
            return (
            <tr>
              <th>{el.carPosition}</th>
              <th>{el.teamName}</th>
              <th>{el.carNumber}</th>
              <th>{el.driverName}</th>
              <th>{el.visualTyreCompound}</th>
              <th>{el.currentLapNumber}</th>
              <th>{el.lastLapTime? Math.floor(el.lastLapTime / 60) % 60 + ":" + Math.floor(el.lastLapTime % 60)+":"+Math.floor(el.lastLapTime *1000%1000):null }</th>
              <th>{el.bestLapTime? Math.floor(el.bestLapTime / 60) % 60 + ":" + Math.floor(el.bestLapTime % 60)+":"+Math.floor(el.bestLapTime *1000%1000):null }</th>
              <th>{el.frontWing}</th>
              <th>{el.rearWing}</th>
              <th>{el.onThrottle}</th>
              <th>{el.offThrottle}</th>
              <th>{el.frontCamber?Math.round(el.frontCamber *100)/100:null}</th>
              <th>{el.rearCamber?Math.round(el.rearCamber *100)/100:null}</th>
              <th>{el.frontToe?Math.round(el.frontToe *100)/100:null}</th>
              <th>{el.rearToe?Math.round(el.rearToe *100)/100:null}</th>
              <th>{el.frontSuspension}</th>
              <th>{el.rearSuspension}</th>
              <th>{el.frontAntiRollBar}</th>
              <th>{el.rearAntiRollBar}</th>
              <th>{el.frontSuspensionHeight}</th>
              <th>{el.rearSuspensionHeight}</th>
              <th>{el.brakePressure}</th>
              <th>{el.brakeBias}</th>
              <th>{el.rearLeftTyrePressure}</th>
              <th>{el.rearRightTyrePressure}</th>
              <th>{el.frontLeftTyrePressure}</th>
              <th>{el.frontRightTyrePressure}</th>
              <th>{el.ballast}</th>
              <th>{el.fuelLoad}</th>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SettingTable;
