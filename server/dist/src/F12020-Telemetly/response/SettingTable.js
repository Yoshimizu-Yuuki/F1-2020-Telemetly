"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSettingTableResponse = void 0;
const common_1 = require("../common/common");
function createSettingTableResponse(lapData, carStatusData, participantsData, carSetupData) {
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
                ? common_1.getTyreName(parseInt(carStatusData.m_carStatusData[index].m_visualTyreCompound.toString(), 10))
                : undefined,
            currentLapNumber: lapData
                ? parseInt(lapData.m_lapData[index].m_currentLapNum.toString(), 10)
                : undefined,
            carPosition: lapData
                ? parseInt(lapData.m_lapData[index].m_carPosition.toString(), 10)
                : undefined,
            lastLapTime: lapData
                ? parseFloat(lapData.m_lapData[index].m_lastLapTime.toString())
                : undefined,
            bestLapTime: lapData
                ? parseFloat(lapData.m_lapData[index].m_bestLapTime.toString())
                : undefined,
            frontWing: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_frontWing.toString(), 10)
                : undefined,
            rearWing: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_rearWing.toString(), 10)
                : undefined,
            onThrottle: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_onThrottle.toString(), 10)
                : undefined,
            offThrottle: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_offThrottle.toString(), 10)
                : undefined,
            frontCamber: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_frontCamber.toString())
                : undefined,
            rearCamber: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_rearCamber.toString())
                : undefined,
            frontToe: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_frontToe.toString())
                : undefined,
            rearToe: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_rearToe.toString())
                : undefined,
            frontSuspension: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_frontSuspension.toString(), 10)
                : undefined,
            rearSuspension: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_rearSuspension.toString(), 10)
                : undefined,
            frontAntiRollBar: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_frontAntiRollBar.toString(), 10)
                : undefined,
            rearAntiRollBar: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_rearAntiRollBar.toString(), 10)
                : undefined,
            frontSuspensionHeight: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_frontSuspensionHeight.toString(), 10)
                : undefined,
            rearSuspensionHeight: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_rearSuspensionHeight.toString(), 10)
                : undefined,
            brakePressure: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_brakePressure.toString(), 10)
                : undefined,
            brakeBias: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_brakeBias.toString(), 10)
                : undefined,
            rearLeftTyrePressure: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_rearLeftTyrePressure.toString())
                : undefined,
            rearRightTyrePressure: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_rearRightTyrePressure.toString())
                : undefined,
            frontLeftTyrePressure: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_rearLeftTyrePressure.toString())
                : undefined,
            frontRightTyrePressure: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_rearRightTyrePressure.toString())
                : undefined,
            ballast: carSetupData
                ? parseInt(carSetupData.m_carSetups[index].m_ballast.toString(), 10)
                : undefined,
            fuelLoad: carSetupData
                ? parseFloat(carSetupData.m_carSetups[index].m_fuelLoad.toString())
                : undefined
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
exports.createSettingTableResponse = createSettingTableResponse;
