"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketHeader_1 = require("./PacketHeader");
function getMarshalZone(message) {
    return {
        m_zoneStart: message.readFloatLE(0),
        m_zoneFlag: message.readInt8(4)
    };
}
function getMarshalZoneData(message) {
    const size = 5;
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
        20
    ].map((el, index) => {
        return getMarshalZone(message.slice(index * size, (index + 1) * size));
    });
}
function getWeatherForecastSample(message) {
    return {
        m_sessionType: message.readUInt8(0),
        m_timeOffset: message.readUInt8(1),
        m_weather: message.readUInt8(2),
        m_trackTemperature: message.readInt8(3),
        m_airTemperature: message.readInt8(4)
    };
}
function getWeatherForecastSampleData(message) {
    const size = 5;
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
        19
    ].map((el, index) => {
        return getWeatherForecastSample(message.slice(index * size, (index + 1) * size));
    });
}
function getPacketSessionData(message) {
    const offset = 24;
    const marshal_offset = 105;
    const weather_offset = 105;
    if (message.byteLength === 251) {
        return {
            m_header: PacketHeader_1.getPacketHeader(message),
            m_weather: message.readUInt8(offset + 0),
            m_trackTemperature: message.readInt8(offset + 1),
            m_airTemperature: message.readInt8(offset + 2),
            m_totalLaps: message.readUInt8(offset + 3),
            m_trackLength: message.readInt16LE(offset + 4),
            m_sessionType: message.readUInt8(offset + 6),
            // 5 = Q1, 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ
            // 10 = R, 11 = R2, 12 = Time Trial
            m_trackId: message.readInt8(offset + 7),
            m_formula: message.readUInt8(offset + 8),
            // 3 = F1 Generic
            m_sessionTimeLeft: message.readInt16LE(offset + 9),
            m_sessionDuration: message.readInt16LE(offset + 11),
            m_pitSpeedLimit: message.readUInt8(offset + 13),
            m_gamePaused: message.readUInt8(offset + 14),
            m_isSpectating: message.readUInt8(offset + 15),
            m_spectatorCarIndex: message.readUInt8(offset + 16),
            m_sliProNativeSupport: message.readUInt8(offset + 17),
            m_numMarshalZones: message.readUInt8(offset + 18),
            m_marshalZones: getMarshalZoneData(message.slice(offset + 19, offset + marshal_offset + 19)),
            m_safetyCarStatus: message.readUInt8(offset + marshal_offset + 19),
            // 2 = virtual safety car
            m_networkGame: message.readUInt8(offset + marshal_offset + 20),
            m_numWeatherForecastSamples: message.readUInt8(offset + marshal_offset + 21),
            m_weatherForecastSamples: getWeatherForecastSampleData(message.slice(offset + marshal_offset + 22, offset + marshal_offset + weather_offset + 22))
        };
    }
    else {
        return null;
    }
}
exports.default = getPacketSessionData;
