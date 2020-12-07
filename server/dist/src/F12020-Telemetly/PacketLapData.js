"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketHeader_1 = require("./PacketHeader");
function getCarLapData(message) {
    return {
        m_lastLapTime: message.readFloatLE(0),
        m_currentLapTime: message.readFloatLE(4),
        m_sector1TimeInMS: message.readUInt16LE(8),
        m_sector2TimeInMS: message.readUInt16LE(10),
        m_bestLapTime: message.readFloatLE(12),
        m_bestLapNum: message.readUInt8(16),
        m_bestLapSector1TimeInMS: message.readUInt16LE(17),
        m_bestLapSector2TimeInMS: message.readUInt16LE(19),
        m_bestLapSector3TimeInMS: message.readUInt16LE(21),
        m_bestOverallSector1TimeInMS: message.readUInt16LE(23),
        m_bestOverallSector1LapNum: message.readUInt8(25),
        m_bestOverallSector2TimeInMS: message.readUInt16LE(26),
        m_bestOverallSector2LapNum: message.readUInt8(28),
        m_bestOverallSector3TimeInMS: message.readUInt16LE(29),
        m_bestOverallSector3LapNum: message.readUInt8(31),
        m_lapDistance: message.readFloatLE(32),
        m_totalDistance: message.readFloatLE(36),
        m_safetyCarDelta: message.readFloatLE(40),
        m_carPosition: message.readUInt8(44),
        m_currentLapNum: message.readUInt8(45),
        m_pitStatus: message.readUInt8(46),
        m_sector: message.readUInt8(47),
        m_currentLapInvalid: message.readUInt8(48),
        m_penalties: message.readUInt8(49),
        m_gridPosition: message.readUInt8(50),
        m_driverStatus: message.readUInt8(51),
        m_resultStatus: message.readUInt8(52)
    };
}
//ヘッダー含めて1190Byte
function getLapData(message) {
    //ヘッダー（24Byte）を除くと53Byte×22台となる。
    const offset = 24;
    const size = 53;
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
        return getCarLapData(message.slice(offset + index * size, offset + (index + 1) * size));
    });
}
function getPacketLapData(message) {
    if (message.byteLength === 1190) {
        return {
            m_header: PacketHeader_1.getPacketHeader(message),
            m_lapData: getLapData(message)
        };
    }
    else {
        return null;
    }
}
exports.default = getPacketLapData;
