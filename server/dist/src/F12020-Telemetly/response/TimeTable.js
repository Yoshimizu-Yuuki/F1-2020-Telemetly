"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeTableResponse = void 0;
const common_1 = require("../common/common");
// createTimeTableのレスポンスデータを作成する
function createTimeTableResponse(lapData, carStatusData, participantsData, deltaTime, lapTime) {
    return [
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
    ]
        .map((el, index) => {
        const deltaTimeItem = deltaTime.find((el) => {
            return (el.carPosition ==
                (lapData
                    ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
                    : undefined));
        });
        const distance = deltaTimeItem
            ? deltaTimeItem.lastTimeDuration
            : undefined;
        const lapTimeItem = lapTime.find((el) => {
            return (el.carPosition ==
                (lapData
                    ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
                    : undefined));
        });
        const sector1 = lapTimeItem
            ? lapTimeItem.showLapTime.sector1
                ? lapTimeItem.showLapTime.sector1
                : undefined
            : undefined;
        const sector2 = lapTimeItem
            ? lapTimeItem.showLapTime.sector2
                ? lapTimeItem.showLapTime.sector2
                : undefined
            : undefined;
        const sector3 = lapTimeItem
            ? lapTimeItem.showLapTime.sector3
                ? lapTimeItem.showLapTime.sector3
                : undefined
            : undefined;
        const lastLapTime = lapTimeItem
            ? lapTimeItem.showLapTime.laptime
                ? lapTimeItem.showLapTime.laptime
                : undefined
            : undefined;
        return {
            teamName: participantsData
                ? common_1.getTeamName(parseInt(participantsData.m_participants[index].m_teamId.toString(), 10))
                : undefined,
            carNumber: participantsData
                ? parseInt(participantsData.m_participants[index].m_raceNumber.toString(), 10)
                : undefined,
            driverName: participantsData
                ? common_1.getDriverName(parseInt(participantsData.m_participants[index].m_driverId.toString(), 10))
                : "",
            visualTyreCompound: carStatusData
                ? parseInt(carStatusData.m_carStatusData[index].m_visualTyreCompound.toString(), 10)
                : undefined,
            currentLapNumber: lapData
                ? parseInt(lapData.m_lapData[index].m_currentLapNum.toString(), 10)
                : undefined,
            carPosition: lapData
                ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
                : undefined,
            sector1,
            sector2,
            sector3,
            distance,
            lastLapTime,
            bestLapTime: lapData
                ? parseFloat(lapData.m_lapData[index].m_bestLapTime.toString())
                : undefined //べストラップ
        };
    })
        .filter((el) => {
        return el.carPosition !== 0;
    })
        .sort((firstEl, secondEl) => {
        if (firstEl.carPosition && secondEl.carPosition)
            return firstEl.carPosition - secondEl.carPosition;
        else
            return 0;
    });
}
exports.createTimeTableResponse = createTimeTableResponse;
