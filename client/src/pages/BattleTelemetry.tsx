import React, { useEffect, useState } from "react";
import BattleTelemetryResponse from "./../../../server/src/F12020-Telemetly/response/BattleTelemetry";
import "./BattleTelemetry.scss";

function BattleTelemetry() {
  let init: Array<BattleTelemetryResponse> = [{}];
  const [battleTelemetryData, setBattleTelemetryData] = useState(init);

  useEffect(() => {
    // Update the document title using the browser API
    const instance = setInterval(() => {
      fetch("http://127.0.0.1:3020/battletelemetry", {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setBattleTelemetryData(data.battletelemetry);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, 300);

    return () => {
      clearInterval(instance);
    };
  });

  return (
    <div className='container'>
      {battleTelemetryData.map((el) => {
        return (
          <div className={"driver-container" + " " + el.teamName}>
            <div className='speedmeter-container'>
              <div className='speedmeter'>
                <span className='drs'>{el.drs ? "DRS" : ""}</span>
                <span className='speed'>{el.speed ? el.speed : "-"}</span>
                <span className='gear'>{el.gear ? el.gear : ""}</span>
                <span className='ers'>
                  ERS:
                  {el.ersStoreEnergy
                    ? Math.round(el.ersStoreEnergy / 40000)
                    : "-"}
                  %
                </span>
              </div>
            </div>
            <div className='tyreinfo-container'>
              <span className='tyre'>
                {el.visualTyreCompound ? el.visualTyreCompound : "UNKNOWN"}
              </span>
              <span className='tyrelap'>
                {el.tyresAgeLaps ? el.tyresAgeLaps + "Lap ago" : "No data"}
              </span>
              <div className='tyredamage-container'>
                <span
                  className='fl'
                  style={{
                    backgroundColor:
                      "hsl(" +
                      (100 - (el.tyresDamage ? el.tyresDamage[2] : 0)) +
                      ", 100, 50)"
                  }}
                >
                  {el.tyresDamage ? el.tyresDamage[2] : "-"}
                </span>
                <span
                  className='fr'
                  style={{
                    backgroundColor:
                      "hsl(" +
                      (100 - (el.tyresDamage ? el.tyresDamage[3] : 0)) +
                      ", 100, 50)"
                  }}
                >
                  {el.tyresDamage ? el.tyresDamage[3] : "-"}
                </span>
                <span
                  className='rl'
                  style={{
                    backgroundColor:
                      "hsl(" +
                      (100 - (el.tyresDamage ? el.tyresDamage[0] : 0)) +
                      ", 100, 50)"
                  }}
                >
                  {el.tyresDamage ? el.tyresDamage[0] : "-"}
                </span>
                <span
                  className='rr'
                  style={{
                    backgroundColor:
                      "hsl(" +
                      (100 - (el.tyresDamage ? el.tyresDamage[1] : 0)) +
                      ", 100, 50)"
                  }}
                >
                  {el.tyresDamage ? el.tyresDamage[1] : "-"}
                </span>
              </div>
            </div>
            <div className='driverinfo-container'>
              <div className='position'>
                {el.carPosition ? el.carPosition : "-"}
              </div>
              <div className='team'>
                {el.teamName ? el.teamName : "UNKNOWN TEAM"}
              </div>

              <div className='driver'>
                <div className='carnumber'>
                  {el.carNumber ? el.carNumber : "-"}
                </div>
                {el.driverName ? el.driverName : "UNKNOWN DRIVER"}
              </div>
              <div className='lastlap'>
                {el.lastLapTime
                  ? "LASTLAP " +
                    (Math.floor(el.lastLapTime / 60) % 60) +
                    ":" +
                    Math.floor(el.lastLapTime % 60) +
                    ":" +
                    Math.floor((el.lastLapTime * 1000) % 1000)
                  : "LASTLAP NODATA"}
              </div>
            </div>
          </div>
        );
      })}
      <div className='lapinfo-container'>
        <div>
          LAP{" "}
          {battleTelemetryData[0]
            ? battleTelemetryData[0].currentLapNumber
            : "-"}
          /
          {battleTelemetryData[0]
            ? battleTelemetryData[0].sessionFullLapNumber
            : "-"}
        </div>
      </div>
      <div className='distance-container'>
        <div>DISTANCE</div>
        <div>
          {battleTelemetryData[1] && battleTelemetryData[1].distance
            ? battleTelemetryData[1].distance / 1000
            : "+/-"}
        </div>
      </div>
      <div className='drszone-container'>
        <div>DRSZone</div>
        <div>
          {battleTelemetryData[1] &&
          battleTelemetryData[1].drsActivationDistance
            ? Math.round(battleTelemetryData[1].drsActivationDistance)
            : "+/-"}
          m
        </div>
      </div>
    </div>
  );
}

function getDeltaTime(distance: number, speed: number): number {
  // 現在の車速 / 3,600,000 = 1秒間に何m進むか[y]
  // Distance m / y = 追いつくまでの秒数。
  // 追いつくまでの秒数　×　1秒間に進む距離 = 離れている距離
  const minuteMeter = (speed ? speed : 1) / 3600000;
  const distanceMinute = distance / minuteMeter;
  return Math.floor(distanceMinute / 1000) / 1000;
  // return distanceMinute;
}

export default BattleTelemetry;
