"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketHeader_1 = require("./PacketHeader");
;
;
function getCarParticipantData(message) {
    return {
        m_aiControlled: message.readUInt8(0),
        m_driverId: message.readUInt8(1),
        m_teamId: message.readUInt8(2),
        m_raceNumber: message.readUInt8(3),
        m_nationality: message.readUInt8(4),
        m_name: message.toString('utf8', 5, 11),
        m_yourTelemetry: message.readUInt8(12),
    };
}
function getParticipantData(message) {
    //ヘッダー（24Byte）+m_numActiveCars（1Byte）を除くと54Byte×22台となる。
    const offset = 24 + 1;
    const size = 54;
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((el, index) => {
        return getCarParticipantData(message.slice(offset + index * size, offset + (index + 1) * size));
    });
}
function getNumActiveCars(message) {
    //ヘッダー（24Byte）を除く
    const offset = 24;
    return message.readUInt8(offset);
}
function getPacketParticipantsData(message) {
    if (message.byteLength === 1213) {
        return {
            m_header: PacketHeader_1.getPacketHeader(message),
            m_numActiveCars: getNumActiveCars(message),
            m_participants: getParticipantData(message)
        };
    }
    else {
        return null;
    }
}
exports.default = getPacketParticipantsData;
