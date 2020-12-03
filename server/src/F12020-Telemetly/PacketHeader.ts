export interface PacketHeader
{
    m_packetFormat:Uint16Array;             // 2020
    m_gameMajorVersion:Uint8Array;         // Game major version - "X.00"
    m_gameMinorVersion:Uint8Array;         // Game minor version - "1.XX"
    m_packetVersion:Uint8Array;            // Version of this packet type, all start from 1
    m_packetId:Uint8Array;                 // Identifier for the packet type, see below
    m_sessionUID:BigUint64Array;               // Unique identifier for the session
    m_sessionTime:Float32Array;              // Session timestamp
    m_frameIdentifier:Uint32Array;          // Identifier for the frame the data was retrieved on
    m_playerCarIndex:Uint8Array;           // Index of player's car in the array    
    // ADDED IN BETA 2: 
    m_secondaryPlayerCarIndex:Uint8Array;  // Index of secondary player's car in the array (splitscreen)
                                            // 255 if no second player
};

export function getPacketHeader(message:any):PacketHeader{
    // ヘッダーの一番最初を取得した瞬間である
    return {
        m_packetFormat:message.readUInt16LE(0),
        m_gameMajorVersion:message.readUInt8(2),
        m_gameMinorVersion:message.readUInt8(3),
        m_packetVersion:message.readUInt8(4),
        m_packetId:message.readUInt8(5),
        m_sessionUID:message.readBigUInt64LE(6),
        m_sessionTime:message.readFloatLE(14),
        m_frameIdentifier:message.readUInt32LE(18),
        m_playerCarIndex:message.readUInt8(22),
        m_secondaryPlayerCarIndex:message.readUInt8(23)
    }
}