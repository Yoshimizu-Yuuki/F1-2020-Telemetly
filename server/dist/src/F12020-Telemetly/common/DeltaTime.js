"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeltaTime = exports.updateDeltaTime = exports.initDeltaTime = void 0;
//レースのデルタタイム。一度開いたらもしかするとさいしょから作り直す必要あり。
let deltaTimeData = [
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
].map((el) => {
    return {
        count: 1,
        carPosition: 0,
        pointTimeDuration: [0],
        lastTimeDuration: 0
    };
});
function initDeltaTime() {
    deltaTimeData = [
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
    ].map((el) => {
        return {
            count: 1,
            carPosition: 0,
            pointTimeDuration: [0],
            lastTimeDuration: 0
        };
    });
}
exports.initDeltaTime = initDeltaTime;
function updateDeltaTime(carLapData) {
    /**
      ・自分自身のtotalDistanceが、前回よりも50m進んだか確認。totalDistance>=count*50
      ・進んでいたら、count++する。次回のフレームでtotalDistance>=count*50を確認するため。
      ・進んでいたら、現在のセッションdurationを添え字countに保存する。
       */
    //セッションタイム入れようと思ったけど、サーバーで秒数計った方がよさそう。
    const sessionTime = Date.now();
    carLapData.m_lapData.forEach((el, index) => {
        //ポジションを添え字にしたいので、更新。
        deltaTimeData[index].carPosition = parseInt(el.m_carPosition.toString(), 10);
        const totalDistance = parseFloat(el.m_totalDistance.toString());
        //・自分自身のtotalDistanceが、前回よりも50m進んだか確認。totalDistance>=count*50
        if (totalDistance >= deltaTimeData[index].count * 50) {
            //・進んでいたら、count++する。次回のフレームでtotalDistance>=count*50を確認するため。
            deltaTimeData[index].count++;
            deltaTimeData[index].pointTimeDuration.push(sessionTime);
        }
    });
}
exports.updateDeltaTime = updateDeltaTime;
function getDeltaTime() {
    //不正なポジションは削除と、ポジション順に並び替え。
    let sortedDeltaTime = deltaTimeData;
    sortedDeltaTime = sortedDeltaTime
        .filter((el) => {
        return el.carPosition;
    })
        .sort((firstEl, secondEl) => {
        return firstEl.carPosition - secondEl.carPosition;
    });
    //デルタタイムの算出。
    for (let i = 0; i < sortedDeltaTime.length; i++) {
        if (i != 0) {
            const duration = sortedDeltaTime[i].pointTimeDuration[sortedDeltaTime[i].count - 1] -
                sortedDeltaTime[i - 1].pointTimeDuration[sortedDeltaTime[i].count - 1];
            sortedDeltaTime[i].lastTimeDuration = duration;
        }
        else {
            //1位の場合は0にしておく。
            sortedDeltaTime[i].lastTimeDuration = 0;
        }
    }
    return sortedDeltaTime;
}
exports.getDeltaTime = getDeltaTime;
