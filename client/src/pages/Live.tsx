import React, { useEffect, useState } from "react";
import "./Live.scss";

/**
 * フォームで動画ファイルを選択する。
 * videoのソースに指定する。
 */
function Live() {
  return (
    <div className='container'>
      <video id="video" height="480" controls></video>
      <input type="file" id="filename" value="ファイル読み込み" />
    </div>
  );
}

export default Live;