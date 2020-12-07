"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimeTableResponse = void 0;
const common_1 = require("../common/common");
// createTimeTableのレスポンスデータを作成する
function createTimeTableResponse(lapData, carStatusData, participantsData) {
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
    ].map((el, index) => {
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
            sector1: lapData
                ? parseInt(lapData.m_lapData[index].m_sector1TimeInMS.toString(), 10)
                : undefined,
            sector2: lapData
                ? parseInt(lapData.m_lapData[index].m_sector2TimeInMS.toString(), 10)
                : undefined,
            distance: lapData
                ? parseFloat(lapData.m_lapData[index].m_totalDistance.toString())
                : 0,
            lastLapTime: lapData
                ? parseFloat(lapData.m_lapData[index].m_lastLapTime.toString())
                : undefined,
            bestLapTime: lapData
                ? parseFloat(lapData.m_lapData[index].m_bestLapTime.toString())
                : undefined //べストラップ
        };
    }).filter((el) => {
        return el.carPosition !== 0;
    }).sort((firstEl, secondEl) => {
        if (firstEl.carPosition && secondEl.carPosition)
            return firstEl.carPosition - secondEl.carPosition;
        else
            return 0;
    });
}
exports.createTimeTableResponse = createTimeTableResponse;
