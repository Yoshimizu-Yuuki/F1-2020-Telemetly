"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPacketHeader = void 0;
;
function getPacketHeader(message) {
    // ヘッダーの一番最初を取得した瞬間である
    return {
        m_packetFormat: message.readUInt16LE(0),
        m_gameMajorVersion: message.readUInt8(2),
        m_gameMinorVersion: message.readUInt8(3),
        m_packetVersion: message.readUInt8(4),
        m_packetId: message.readUInt8(5),
        m_sessionUID: message.readBigUInt64LE(6),
        m_sessionTime: message.readFloatLE(14),
        m_frameIdentifier: message.readUInt32LE(18),
        m_playerCarIndex: message.readUInt8(22),
        m_secondaryPlayerCarIndex: message.readUInt8(23)
    };
}
exports.getPacketHeader = getPacketHeader;
