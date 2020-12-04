import { PacketHeader, getPacketHeader } from "./PacketHeader";

//タイヤ情報とかが入ってる。
interface CarStatusData {
  m_tractionControl: Uint8Array; // 0 (off) - 2 (high)
  m_antiLockBrakes: Uint8Array; // 0 (off) - 1 (on)
  m_fuelMix: Uint8Array; // Fuel mix - 0 = lean, 1 = standard, 2 = rich, 3 = max
  m_frontBrakeBias: Uint8Array; // Front brake bias (percentage)
  m_pitLimiterStatus: Uint8Array; // Pit limiter status - 0 = off, 1 = on
  m_fuelInTank: Float32Array; // Current fuel mass
  m_fuelCapacity: Float32Array; // Fuel capacity
  m_fuelRemainingLaps: Float32Array; // Fuel remaining in terms of laps (value on MFD)
  m_maxRPM: Uint16Array; // Cars max RPM, point of rev limiter
  m_idleRPM: Uint16Array; // Cars idle RPM
  m_maxGears: Uint8Array; // Maximum number of gears
  m_drsAllowed: Uint8Array; // 0 = not allowed, 1 = allowed, -1 = unknown

  // Added in Beta3:
  m_drsActivationDistance: Uint16Array; // 0 = DRS not available, non-zero - DRS will be available
  // in [X] metres

  m_tyresWear: Uint8Array[]; // Tyre wear percentage [4]
  m_actualTyreCompound: Uint8Array; // F1 Modern - 16 = C5, 17 = C4, 18 = C3, 19 = C2, 20 = C1
  // 7 = inter, 8 = wet
  // F1 Classic - 9 = dry, 10 = wet
  // F2 – 11 = super soft, 12 = soft, 13 = medium, 14 = hard
  // 15 = wet
  m_visualTyreCompound: Uint8Array; // F1 visual (can be different from actual compound)
  // 16 = soft, 17 = medium, 18 = hard, 7 = inter, 8 = wet
  // F1 Classic – same as above
  // F2 – same as above
  m_tyresAgeLaps: Uint8Array; // Age in laps of the current set of tyres
  m_tyresDamage: Uint8Array[]; // Tyre damage (percentage) [4]
  m_frontLeftWingDamage: Uint8Array; // Front left wing damage (percentage)
  m_frontRightWingDamage: Uint8Array; // Front right wing damage (percentage)
  m_rearWingDamage: Uint8Array; // Rear wing damage (percentage)

  // Added Beta 3:
  m_drsFault: Uint8Array; // Indicator for DRS fault, 0 = OK, 1 = fault

  m_engineDamage: Uint8Array; // Engine damage (percentage)
  m_gearBoxDamage: Uint8Array; // Gear box damage (percentage)
  m_vehicleFiaFlags: Int8Array; // -1 = invalid/unknown, 0 = none, 1 = green
  // 2 = blue, 3 = yellow, 4 = red
  m_ersStoreEnergy: Float32Array; // ERS energy store in Joules
  m_ersDeployMode: Uint8Array; // ERS deployment mode, 0 = none, 1 = medium
  // 2 = overtake, 3 = hotlap
  m_ersHarvestedThisLapMGUK: Float32Array; // ERS energy harvested this lap by MGU-K
  m_ersHarvestedThisLapMGUH: Float32Array; // ERS energy harvested this lap by MGU-H
  m_ersDeployedThisLap: Float32Array; // ERS energy deployed this lap
}

export interface PacketCarStatusData {
  m_header: PacketHeader; // Header

  m_carStatusData: CarStatusData[];
}

function getCarStatusData(message: any): CarStatusData {
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
      message.readUInt8(5)
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
function getStatusData(message: any): CarStatusData[] {
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
    return getCarStatusData(
      message.slice(offset + index * size, offset + (index + 1) * size)
    );
  });
}

export default function getPacketCarStatusData(
  message: any
): PacketCarStatusData | null {
  if (message.byteLength === 1344) {
    return {
      m_header: getPacketHeader(message),
      m_carStatusData: getStatusData(message)
    };
  } else {
    return null;
  }
}
