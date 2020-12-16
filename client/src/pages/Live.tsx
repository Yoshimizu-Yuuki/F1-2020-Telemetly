import React, { useEffect, useState,useRef } from "react";
import LiveTelemetryResponse from "./../../../server/src/F12020-Telemetly/response/LiveTelemetry";
import "./Live.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from '@fortawesome/free-solid-svg-icons'
import TimeTableResponse from "../../../server/src/F12020-Telemetly/response/TimeTable";

/**
 * フォームで動画ファイルを選択する。
 * videoのソースに指定する。
 */
function Live() {
  let init: LiveTelemetryResponse={};
  const [liveTelemetryData, setLiveTelemetryData] = useState(init);
  const [mode, setMode] = useState("load");
  const [url,setUrl] = useState("");
  const fileEl:React.MutableRefObject<any> = useRef(null);
  const videoEl:React.MutableRefObject<any> = useRef(null);
  const [instance,setInstance] = useState<any>();

  const getData=()=>{
    fetch("http://127.0.0.1:3020/live", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setLiveTelemetryData(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    return function cleanup() {
      // console.log("呼ばれている説");
      // URL.revokeObjectURL(url);
      // window.clearInterval(instance)
    };
  });

  const playMovie=()=>{
    setMode("play");
    videoEl.current.play();
    let interval = window.setInterval(getData, 500);
    setInstance(interval);
  }

  const changeFile = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e&& e.target && e.target.files && e.target.files[0]){
      let url = URL.createObjectURL(e.target.files[0]);
      setUrl(url);
      if(videoEl!==null && videoEl.current !== null){
        videoEl.current.src = url;
      }
    }
    else{
      console.log("空っぽ");
    }
  }

  interface Tyre{tyrename:string,initial:string};


  const tyreCheck = (num:string):Tyre=>{
    switch(num){
      case "intermediate": return {tyrename:"intermediate",initial:"I"};
      case "wet": return {tyrename:"wet",initial:"W"}
      case "soft":
        return {tyrename:"soft",initial:"S"};
      case "medium": return {tyrename:"medium",initial:"M"};
      case "hard": return {tyrename:"hard",initial:"H"};
      default: return {tyrename:"unknown",initial:"U"}
    }
  }

  return (
    <div className='container'>
      <div className="overlay-lap-container">
        <div className="lap">{liveTelemetryData.timetable?liveTelemetryData.timetable[0].currentLapNumber:1} / {liveTelemetryData.totalLap?liveTelemetryData.totalLap:1}</div>
      </div>
      {mode==="play"?(
      <div className='overlay-container'>
        <table className="ranktable">

          {liveTelemetryData.safetiycar == 1?
            (<div className="safetycar">
              <FontAwesomeIcon icon={faCar} />
              <span>SAFETY CAR</span>
            </div>):
            null
          }

          {liveTelemetryData.safetiycar == 2?
            (<div className="safetycar">
              <FontAwesomeIcon icon={faCar} />
              <span>VERTUAL SAFETY CAR</span>
            </div>):
            null
          }
          
          <tbody>
          {
            liveTelemetryData&&liveTelemetryData.timetable?liveTelemetryData.timetable.map((el:TimeTableResponse)=>{
              return (
                <tr>
                <td className={"position" + (el.isFastest?" purple":"")}>{el.carPosition?el.carPosition:null}</td>
                <td className={"team "+ (el.teamName?el.teamName:"")}></td>
                <td className="driver">{el.driverName?el.driverName:"Yuyuyu"}</td>
                <td className={"tyre "+ tyreCheck(el.visualTyreCompound?el.visualTyreCompound:"0").tyrename}>{tyreCheck(el.visualTyreCompound?el.visualTyreCompound:"0").initial}</td>
                <td className="distance">{el.distance?(Math.floor(el.distance/1000)%1000)+"."+('000' + (el.distance % 1000)).slice(-3):"+/-"}</td>
              </tr>
              )
            }):null
          }
          </tbody>
        </table>
      </div>):null}
      <video ref={videoEl} onCanPlayThrough={()=>playMovie()} preload="auto" id="video" width="100%" controls></video>
      <form>
        <input ref={fileEl} type="file" id="filename" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{changeFile(e)}} />
      </form>
    </div>
  );
}

export default Live;