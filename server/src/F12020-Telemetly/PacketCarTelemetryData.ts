import { PacketHeader, getPacketHeader } from "./PacketHeader";

interface CarTelemetryData
{
    m_speed:Uint16Array;                         // Speed of car in kilometres per hour
    m_throttle:Float32Array;                      // Amount of throttle applied (0.0 to 1.0)
    m_steer:Float32Array;                         // Steering (-1.0 (full lock left) to 1.0 (full lock right))
    m_brake:Float32Array;                         // Amount of brake applied (0.0 to 1.0)
    m_clutch:Uint8Array;                        // Amount of clutch applied (0 to 100)
    m_gear:Int8Array;                          // Gear selected (1-8, N=0, R=-1)
    m_engineRPM:Uint16Array;                     // Engine RPM
    m_drs:Uint8Array;                           // 0 = off, 1 = on
    m_revLightsPercent:Uint8Array;              // Rev lights indicator (percentage)
    m_brakesTemperature:Uint16Array[];          // Brakes temperature (celsius)[4]
    m_tyresSurfaceTemperature:Uint8Array[];    // Tyres surface temperature (celsius)[4]
    m_tyresInnerTemperature:Uint8Array[];      // Tyres inner temperature (celsius)[4]
    m_engineTemperature:Uint16Array;             // Engine temperature (celsius)[4]
    m_tyresPressure:Float32Array[];              // Tyres pressure (PSI)[4]
    m_surfaceType:Uint8Array[];                // Driving surface, see appendices[4]
};

export interface PacketCarTelemetryData
{
    m_header:PacketHeader;	       // Header

    m_carTelemetryData:CarTelemetryData[];

    m_buttonStatus:Uint32Array;        // Bit flags specifying which buttons are being pressed
                                               // currently - see appendices
    // Added in Beta 3:
    m_mfdPanelIndex:Uint8Array;       // Index of MFD panel open - 255 = MFD closed
                                               // Single player, race – 0 = Car setup, 1 = Pits
                                               // 2 = Damage, 3 =  Engine, 4 = Temperatures
                                               // May vary depending on game mode
    m_mfdPanelIndexSecondaryPlayer:Uint8Array;   // See above
    m_suggestedGear:Int8Array;       // Suggested gear for the player (1-8)
                                               // 0 if no gear suggested
};

function getCarTelemetryData(message: any): CarTelemetryData {
  return {
    m_speed:message.readUint16LE(0),                         // Speed of car in kilometres per hour
    m_throttle:message.readFloatLE(2),                      // Amount of throttle applied (0.0 to 1.0)
    m_steer:message.readFloatLE(6),                         // Steering (-1.0 (full lock left) to 1.0 (full lock right))
    m_brake:message.readFloatLE(10),                         // Amount of brake applied (0.0 to 1.0)
    m_clutch:message.readUint8(14),                        // Amount of clutch applied (0 to 100)
    m_gear:message.readInt8(15),                          // Gear selected (1-8, N=0, R=-1)
    m_engineRPM:message.readUint16LE(16),                     // Engine RPM
    m_drs:message.readUint8(18),                           // 0 = off, 1 = on
    m_revLightsPercent:message.readUint8(19),              // Rev lights indicator (percentage)
    m_brakesTemperature:[message.readUint16LE(20),message.readUint16LE(22),message.readUint16LE(24),message.readUint16LE(26)],          // Brakes temperature (celsius)[4]
    m_tyresSurfaceTemperature:[message.readUint8(28),message.readUint8(29),message.readUint8(30),message.readUint8(31)],    // Tyres surface temperature (celsius)[4]
    m_tyresInnerTemperature:[message.readUint8(32),message.readUint8(33),message.readUint8(34),message.readUint8(35)],      // Tyres inner temperature (celsius)[4]
    m_engineTemperature:message.readUint16LE(36),             // Engine temperature (celsius)[4]
    m_tyresPressure:[message.readFloatLE(38),message.readFloatLE(42),message.readFloatLE(46),message.readFloatLE(50)],              // Tyres pressure (PSI)[4]
    m_surfaceType:[message.readUint8(51),message.readUint8(52),message.readUint8(53),message.readUint8(54)],                // Driving surface, see appendices[4]
  };
}

//1307Byte
function getTelemetryData(message: any): CarTelemetryData[] {
  //ヘッダー（24Byte）を除くと55Byte×22台となる。
  const offset = 24;
  const size = 55;
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
    return getCarTelemetryData(
      message.slice(offset + index * size, offset + (index + 1) * size)
    );
  });
}

function getButtonStatus(message:any):Uint32Array{
  //ヘッダー（24Byte）を除く
  const offset = 24 + 55*22;
  return message.readUInt32LE(offset);
}

function getMfdPanelIndex(message:any):Uint8Array{
  //ヘッダー（24Byte）を除く
  const offset = 24 + 55*22 + 4;
  return message.readUInt8(offset);
}

function getMfdPanelIndexSecondary(message:any):Uint8Array{
  //ヘッダー（24Byte）を除く
  const offset = 24 + 55*22 + 5;
  return message.readUInt8(offset);
}

function getSuggestedGear(message:any):Int8Array{
  //ヘッダー（24Byte）を除く
  const offset = 24 + 55*22 + 6;
  return message.readInt8(offset);
}

export default function getPacketCarTelemetryData(
  message: any
): PacketCarTelemetryData | null {
  if (message.byteLength === 1307) {
    return {
      m_header: getPacketHeader(message),
      m_carTelemetryData: getTelemetryData(message),
      m_buttonStatus:getButtonStatus(message),
    m_mfdPanelIndex:getMfdPanelIndex(message),
    m_mfdPanelIndexSecondaryPlayer:getMfdPanelIndexSecondary(message),
    m_suggestedGear:getSuggestedGear(message)
    };
  } else {
    return null;
  }
}
