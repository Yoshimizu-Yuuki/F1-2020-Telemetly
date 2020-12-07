"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PacketHeader_1 = require("./PacketHeader");
function getCarStatusData(message) {
    return {
        m_tractionControl: message.readUInt8(0),
        m_antiLockBrakes: message.readUInt8(1),
        m_fuelMix: message.readUInt8(2),
        m_frontBrakeBias: message.readUInt8(3),
        m_pitLimiterStatus: message.readUInt8(4),
        m_fuelInTank: message.readFloatLE(5),
        m_fuelCapacity: message.readFloatLE(9),
        m_fuelRemainingLaps: message.readFloatLE(13),
        m_maxRPM: message.readUInt16LE(17),
        m_idleRPM: message.readUInt16LE(19),
        m_maxGears: message.readUInt8(21),
        m_drsAllowed: message.readUInt8(22),
        m_drsActivationDistance: message.readUInt16LE(23),
        m_tyresWear: [
            message.readUInt8(25),
            message.readUInt8(26),
            message.readUInt8(27),
            message.readUInt8(28)
        ],
        m_actualTyreCompound: message.readUInt8(29),
        m_visualTyreCompound: message.readUInt8(30),
        m_tyresAgeLaps: message.readUInt8(31),
        m_tyresDamage: [
            message.readUInt8(32),
            message.readUInt8(33),
            message.readUInt8(34),
            message.readUInt8(35)
        ],
        m_frontLeftWingDamage: message.readUInt8(36),
        m_frontRightWingDamage: message.readUInt8(37),
        m_rearWingDamage: message.readUInt8(38),
        m_drsFault: message.readUInt8(39),
        m_engineDamage: message.readUInt8(40),
        m_gearBoxDamage: message.readUInt8(41),
        m_vehicleFiaFlags: message.readUInt8(42),
        m_ersStoreEnergy: message.readFloatLE(43),
        m_ersDeployMode: message.readUInt8(47),
        m_ersHarvestedThisLapMGUK: message.readFloatLE(48),
        m_ersHarvestedThisLapMGUH: message.readFloatLE(52),
        m_ersDeployedThisLap: message.readFloatLE(56)
    };
}
//1344Byte
function getStatusData(message) {
    //ヘッダー（24Byte）を除くと60Byte×22台となる。
    const offset = 24;
    const size = 60;
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
        return getCarStatusData(message.slice(offset + index * size, offset + (index + 1) * size));
    });
}
function getPacketCarStatusData(message) {
    if (message.byteLength === 1344) {
        return {
            m_header: PacketHeader_1.getPacketHeader(message),
            m_carStatusData: getStatusData(message)
        };
    }
    else {
        return null;
    }
}
exports.default = getPacketCarStatusData;
