"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketHeader_1 = require("./PacketHeader");
;
;
function getCarSetupData(message) {
    return {
        m_frontWing: message.readUInt8(0),
        m_rearWing: message.readUInt8(1),
        m_onThrottle: message.readUInt8(2),
        m_offThrottle: message.readUInt8(3),
        m_frontCamber: message.readFloatLE(4),
        m_rearCamber: message.readFloatLE(8),
        m_frontToe: message.readFloatLE(12),
        m_rearToe: message.readFloatLE(16),
        m_frontSuspension: message.readUInt8(20),
        m_rearSuspension: message.readUInt8(21),
        m_frontAntiRollBar: message.readUInt8(22),
        m_rearAntiRollBar: message.readUInt8(23),
        m_frontSuspensionHeight: message.readUInt8(24),
        m_rearSuspensionHeight: message.readUInt8(25),
        m_brakePressure: message.readUInt8(26),
        m_brakeBias: message.readUInt8(27),
        m_rearLeftTyrePressure: message.readFloatLE(28),
        m_rearRightTyrePressure: message.readFloatLE(32),
        m_frontLeftTyrePressure: message.readFloatLE(36),
        m_frontRightTyrePressure: message.readFloatLE(40),
        m_ballast: message.readUInt8(44),
        m_fuelLoad: message.readFloatLE(45),
    };
}
//1102Byte
function getSetupData(message) {
    //ヘッダー（24Byte）を除くと60Byte×22台となる。
    const offset = 24;
    const size = 49;
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
        return getCarSetupData(message.slice(offset + index * size, offset + (index + 1) * size));
    });
}
function getPacketCarSetupData(message) {
    if (message.byteLength === 1102) {
        return {
            m_header: PacketHeader_1.getPacketHeader(message),
            m_carSetups: getSetupData(message)
        };
    }
    else {
        return null;
    }
}
exports.default = getPacketCarSetupData;
