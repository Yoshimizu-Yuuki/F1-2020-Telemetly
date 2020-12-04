import React, { useEffect, useState } from "react";
import TimeTableResponse from "./../../../server/src/F12020-Telemetly/response/TimeTable";
import "./TimeTable.scss";

function TimeTable() {
  let init: TimeTableResponse[] = [{}];
  const [timeTableData, setTimeTableData] = useState(init);

  useEffect(() => {
    // Update the document title using the browser API
    const instance = setInterval(() => {
      fetch("", {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setTimeTableData(data.timeTable);
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
            <th>Team</th>
            <th>Car No</th>
            <th>Driver</th>
            <th>Tyre</th>
            <th>Lap</th>
            <th>Pos</th>
            <th>S1</th>
            <th>S2</th>
            <th>S3</th>
            <th>CurrentLapTime</th>
            <th>LastLapTime</th>
            <th>BestLapTime</th>
          </tr>
        </thead>
        <tbody className='timetable-body'>
          {timeTableData.map((el: TimeTableResponse) => {
            <tr>
              <th>{el.teamName}</th>
              <th>{el.carNumber}</th>
              <th>{el.driverName}</th>
              <th>{el.visualTyreCompound}</th>
              <th>{el.currentLapNumber}</th>
              <th>{el.carPosition}</th>
              <th>{el.sector1}</th>
              <th>{el.sector2}</th>
              <th>S3</th>
              <th>{el.currentLapTime}</th>
              <th>{el.currentLapNumber}</th>
              <th>{el.bestLapTime}</th>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TimeTable;
