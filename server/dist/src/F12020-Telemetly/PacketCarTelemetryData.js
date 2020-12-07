"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketHeader_1 = require("./PacketHeader");
;
;
function getCarTelemetryData(message) {
    return {
        m_speed: message.readUInt16LE(0),
        m_throttle: message.readFloatLE(2),
        m_steer: message.readFloatLE(6),
        m_brake: message.readFloatLE(10),
        m_clutch: message.readUInt8(14),
        m_gear: message.readInt8(15),
        m_engineRPM: message.readUInt16LE(16),
        m_drs: message.readUInt8(18),
        m_revLightsPercent: message.readUInt8(19),
        m_brakesTemperature: [message.readUInt16LE(20), message.readUInt16LE(22), message.readUInt16LE(24), message.readUInt16LE(26)],
        m_tyresSurfaceTemperature: [message.readUInt8(28), message.readUInt8(29), message.readUInt8(30), message.readUInt8(31)],
        m_tyresInnerTemperature: [message.readUInt8(32), message.readUInt8(33), message.readUInt8(34), message.readUInt8(35)],
        m_engineTemperature: message.readUInt16LE(36),
        m_tyresPressure: [message.readFloatLE(38), message.readFloatLE(42), message.readFloatLE(46), message.readFloatLE(50)],
        m_surfaceType: [message.readUInt8(54), message.readUInt8(55), message.readUInt8(56), message.readUInt8(57)],
    };
}
//1307Byte
function getTelemetryData(message) {
    //ヘッダー（24Byte）を除くと58Byte×22台となる。
    const offset = 24;
    const size = 58;
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
        return getCarTelemetryData(message.slice(offset + index * size, offset + (index + 1) * size));
    });
}
function getButtonStatus(message) {
    //ヘッダー（24Byte）を除く
    const offset = 24 + 58 * 22;
    return message.readUInt32LE(offset);
}
function getMfdPanelIndex(message) {
    //ヘッダー（24Byte）を除く
    const offset = 24 + 58 * 22 + 4;
    return message.readUInt8(offset);
}
function getMfdPanelIndexSecondary(message) {
    //ヘッダー（24Byte）を除く
    const offset = 24 + 58 * 22 + 5;
    return message.readUInt8(offset);
}
function getSuggestedGear(message) {
    //ヘッダー（24Byte）を除く
    const offset = 24 + 58 * 22 + 6;
    return message.readInt8(offset);
}
function getPacketCarTelemetryData(message) {
    if (message.byteLength === 1307) {
        return {
            m_header: PacketHeader_1.getPacketHeader(message),
            m_carTelemetryData: getTelemetryData(message),
            m_buttonStatus: getButtonStatus(message),
            m_mfdPanelIndex: getMfdPanelIndex(message),
            m_mfdPanelIndexSecondaryPlayer: getMfdPanelIndexSecondary(message),
            m_suggestedGear: getSuggestedGear(message)
        };
    }
    else {
        return null;
    }
}
exports.default = getPacketCarTelemetryData;
