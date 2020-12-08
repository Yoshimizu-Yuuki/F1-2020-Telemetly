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
    }, 1000);

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
                <td>{el.carPosition}</td>
                <td className="driver">{el.driverName}</td>
                <td>{el.visualTyreCompound}</td>
                <td>{el.distance?(Math.floor(el.distance/1000)%1000)+"."+('000' + (el.distance % 1000)).slice(-3):"+/-"}</td>
                <td>{el.currentLapNumber}</td>
                <td>{el.sector1 ? Math.floor(el.sector1/1000) + "." + ('000' + Math.floor(el.sector1 ) %1000).slice(-3) : null}</td>
                <td>{el.sector2 ? Math.floor(el.sector2/1000) + "." + ('000' + Math.floor(el.sector2 ) %1000).slice(-3) : null}</td>
                <td>{el.sector3 ? Math.floor(el.sector3/1000) + "." + ('000' + Math.floor(el.sector3 ) %1000).slice(-3) : null}</td>
                <td>
                  {el.lastLapTime
                    ? (Math.floor(el.lastLapTime / 60) % 60) +
                    ":" +
                    ( '00' + Math.floor(el.lastLapTime % 60)).slice(-2) +
                    ":" +
                    ( '000' + Math.floor((el.lastLapTime * 1000) % 1000)).slice(-3)
                    : null}
                </td>
                <td>
                  {el.bestLapTime
                    ? (Math.floor(el.bestLapTime / 60) % 60) +
                    ":" +
                    ( '00' + Math.floor(el.bestLapTime % 60)).slice(-2) +
                    ":" +
                    ( '000' + Math.floor((el.bestLapTime * 1000) % 1000)).slice(-3)
                    : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TimeTable;
