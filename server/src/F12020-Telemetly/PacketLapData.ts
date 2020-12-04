import { PacketHeader, getPacketHeader } from "./PacketHeader";

//ラップタイムが入っています。
interface LapData {
  m_lastLapTime: Float32Array; // Last lap time in seconds
  m_currentLapTime: Float32Array; // Current time around the lap in seconds
  //UPDATED in Beta 3:
  m_sector1TimeInMS: Uint16Array; // Sector 1 time in milliseconds
  m_sector2TimeInMS: Uint16Array; // Sector 2 time in milliseconds
  m_bestLapTime: Float32Array; // Best lap time of the session in seconds
  m_bestLapNum: Uint8Array; // Lap number best time achieved on
  m_bestLapSector1TimeInMS: Uint16Array; // Sector 1 time of best lap in the session in milliseconds
  m_bestLapSector2TimeInMS: Uint16Array; // Sector 2 time of best lap in the session in milliseconds
  m_bestLapSector3TimeInMS: Uint16Array; // Sector 3 time of best lap in the session in milliseconds
  m_bestOverallSector1TimeInMS: Uint16Array; // Best overall sector 1 time of the session in milliseconds
  m_bestOverallSector1LapNum: Uint8Array; // Lap number best overall sector 1 time achieved on
  m_bestOverallSector2TimeInMS: Uint16Array; // Best overall sector 2 time of the session in milliseconds
  m_bestOverallSector2LapNum: Uint8Array; // Lap number best overall sector 2 time achieved on
  m_bestOverallSector3TimeInMS: Uint16Array; // Best overall sector 3 time of the session in milliseconds
  m_bestOverallSector3LapNum: Uint8Array; // Lap number best overall sector 3 time achieved on
  m_lapDistance: Float32Array; // Distance vehicle is around current lap in metres – could
  // be negative if line hasn’t been crossed yet
  m_totalDistance: Float32Array; // Total distance travelled in session in metres – could
  // be negative if line hasn’t been crossed yet
  m_safetyCarDelta: Float32Array; // Delta in seconds for safety car
  m_carPosition: Uint8Array; // Car race position
  m_currentLapNum: Uint8Array; // Current lap number
  m_pitStatus: Uint8Array; // 0 = none, 1 = pitting, 2 = in pit area
  m_sector: Uint8Array; // 0 = sector1, 1 = sector2, 2 = sector3
  m_currentLapInvalid: Uint8Array; // Current lap invalid - 0 = valid, 1 = invalid
  m_penalties: Uint8Array; // Accumulated time penalties in seconds to be added
  m_gridPosition: Uint8Array; // Grid position the vehicle started the race in
  m_driverStatus: Uint8Array; // Status of driver - 0 = in garage, 1 = flying lap
  // 2 = in lap, 3 = out lap, 4 = on track
  m_resultStatus: Uint8Array; // Result status - 0 = invalid, 1 = inactive, 2 = active
  // 3 = finished, 4 = disqualified, 5 = not classified
  // 6 = retired
}

function getCarLapData(message: any): LapData {
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
function getLapData(message: any): LapData[] {
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
    return getCarLapData(
      message.slice(offset + index * size, offset + (index + 1) * size)
    );
  });
}

export default function getPacketLapData(message: any): PacketLapData | null {
  if (message.byteLength === 1190) {
    return {
      m_header: getPacketHeader(message),
      m_lapData: getLapData(message)
    };
  } else {
    return null;
  }
}

export interface PacketLapData {
  m_header: PacketHeader; // Header
  m_lapData: LapData[]; // Lap data for all cars on track length22
}
