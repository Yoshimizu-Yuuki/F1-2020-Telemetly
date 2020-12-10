import React, { useEffect, useState,useRef } from "react";
import "./Live.scss";

/**
 * フォームで動画ファイルを選択する。
 * videoのソースに指定する。
 */
function Live() {
  const [mode, setMode] = useState("load");
  const [url,setUrl] = useState("");
  const fileEl:React.MutableRefObject<any> = useRef(null);
  const videoEl:React.MutableRefObject<any> = useRef(null);

   useEffect(() => {
    return function cleanup() {
      URL.revokeObjectURL(url);
    };
  });

  const changeFile = (e:React.ChangeEvent<HTMLInputElement>)=>{
    if(e&& e.target && e.target.files && e.target.files[0]){
      let url = URL.createObjectURL(e.target.files[0]);
      setUrl(url);
      if(videoEl!==null && videoEl.current !== null){
        videoEl.current.src = url;
        setMode("play");
      }
    }
    else{
      console.log("空っぽ");
    }
  }

  return (
    <div className='container'>
      <div className="overlay-lap-container">
      <div className="lap">3 / 53</div>
      </div>
      {mode==="play"?(
      <div className='overlay-container'>
        <table className="ranktable">
          <tbody>
          {
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((el,index)=>{
              return (
                <tr>
                <td className="position">{index + 1}</td>
                <td className="team" style={{backgroundColor:"hsl("+ (index * 15) +",100%,50%)"}}></td>
                <td className="driver">{"HAMILTON_" + index}</td>
                <td className="tyre">S</td>
              </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>):null}
      <video ref={videoEl} id="video" width="100%" controls></video>
      <form>
        <input ref={fileEl} type="file" id="filename" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{changeFile(e)}} />
      </form>
    </div>
  );
}

export default Live;