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
    }, 5000);

    return () => {
      clearInterval(instance);
    };
  });

  return (
    <div className='container'>
      <div className='driver-container'>
        <div className='speedmeter-container'>
          <div className='speedmeter'>
            <span className='drs'>DRS</span>
            <span className='speed'>300</span>
            <span className='gear'>7</span>
            <span className='ers'>ERS:25%</span>
          </div>
        </div>
        <div className='tyreinfo-container'>
          <span className='tyre'>SOFT</span>
          <span className='tyrelap'>25 Lap ago</span>
          <div className='tyredamage-container'>
            <span className='fl'>40</span>
            <span className='fr'>35</span>
            <span className='rl'>38</span>
            <span className='rr'>32</span>
          </div>
        </div>
        <div className='driverinfo-container'>
          <div className='position'>1</div>
          <div className='team'>Redbull</div>

          <div className='driver'>
            <div className='carnumber'>33</div>
            Max Verrstapen
          </div>
          <div className='lastlap'>LASTLAP 1:32:359</div>
        </div>
      </div>

      {/* 追加 */}
      <div className='driver-container'>
        <div className='speedmeter-container'>
          <div className='speedmeter'>
            <span className='drs'>DRS</span>
            <span className='speed'>300</span>
            <span className='gear'>7</span>
            <span className='ers'>ERS:25%</span>
          </div>
        </div>
        <div className='tyreinfo-container'>
          <span className='tyre'>SOFT</span>
          <span className='tyrelap'>25 Lap ago</span>
          <div className='tyredamage-container'>
            <span className='fl'>40</span>
            <span className='fr'>35</span>
            <span className='rl'>38</span>
            <span className='rr'>32</span>
          </div>
        </div>
        <div className='driverinfo-container'>
          <div className='position'>1</div>
          <div className='team'>Redbull</div>

          <div className='driver'>
            <div className='carnumber'>33</div>
            Max Verrstapen
          </div>
          <div className='lastlap'>LASTLAP 1:32:359</div>
        </div>
      </div>
      <div className='lapinfo-container'>
        <div>LAP 5/53</div>
      </div>
      <div className='distance-container'>
        <div>DISTANCE</div>
        <div>580m</div>
      </div>
      <div className='drszone-container'>
        <div>DRSZone</div>
        <div>580m</div>
      </div>
    </div>
  );
}

export default BattleTelemetry;
