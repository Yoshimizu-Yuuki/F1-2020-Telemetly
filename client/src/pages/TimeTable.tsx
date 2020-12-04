import React, { useEffect, useState } from "react";
import TimeTableResponse from "./../../../server/src/F12020-Telemetly/response/TimeTable";
import "./TimeTable.scss";

function TimeTable() {
  let init: Array<TimeTableResponse> = [{}];
  const [timeTableData, setTimeTableData] = useState(init);

  useEffect(() => {
    // Update the document title using the browser API
    const instance = setInterval(() => {
      fetch("http://127.0.0.1:3020/timetable", {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setTimeTableData(data.timetable);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }, 5000);

    return () => {
      clearInterval(instance);
    };
  });

  return (
    <div className='container'>
      <table className='timetable'>
        <thead className='timetable-header'>
          <tr>
          <th>Pos</th>
            <th>Team</th>
            <th>Car No</th>
            <th>Driver</th>
            <th>Tyre</th>
            <th>Distance</th>
            <th>Lap</th>
            <th>S1</th>
            <th>S2</th>
            <th>S3</th>
            <th>LastLapTime</th>
            <th>BestLapTime</th>
          </tr>
        </thead>
        <tbody className='timetable-body'>
          {timeTableData.map((el: TimeTableResponse) => {
            return (
            <tr>
              <th>{el.carPosition}</th>
              <th>{el.teamName}</th>
              <th>{el.carNumber}</th>
              <th>{el.driverName}</th>
              <th>{el.visualTyreCompound}</th>
              <th>{el.distance}</th>
              <th>{el.currentLapNumber}</th>
              <th>{el.sector1?el.sector1/1000:null}</th>
              <th>{el.sector2?el.sector2/1000:null}</th>
              <th>S3</th>
              
              <th>{el.lastLapTime? Math.floor(el.lastLapTime / 60) % 60 + ":" + Math.floor(el.lastLapTime % 60)+":"+Math.floor(el.lastLapTime *1000%1000):null }</th>
              <th>{el.bestLapTime? Math.floor(el.bestLapTime / 60) % 60 + ":" + Math.floor(el.bestLapTime % 60)+":"+Math.floor(el.bestLapTime *1000%1000):null }</th>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TimeTable;
