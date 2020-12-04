import { PacketHeader, getPacketHeader } from "./PacketHeader";

struct CarTelemetryData
{
    uint16    m_speed;                         // Speed of car in kilometres per hour
    float     m_throttle;                      // Amount of throttle applied (0.0 to 1.0)
    float     m_steer;                         // Steering (-1.0 (full lock left) to 1.0 (full lock right))
    float     m_brake;                         // Amount of brake applied (0.0 to 1.0)
    uint8     m_clutch;                        // Amount of clutch applied (0 to 100)
    int8      m_gear;                          // Gear selected (1-8, N=0, R=-1)
    uint16    m_engineRPM;                     // Engine RPM
    uint8     m_drs;                           // 0 = off, 1 = on
    uint8     m_revLightsPercent;              // Rev lights indicator (percentage)
    uint16    m_brakesTemperature[4];          // Brakes temperature (celsius)
    uint8     m_tyresSurfaceTemperature[4];    // Tyres surface temperature (celsius)
    uint8     m_tyresInnerTemperature[4];      // Tyres inner temperature (celsius)
    uint16    m_engineTemperature;             // Engine temperature (celsius)
    float     m_tyresPressure[4];              // Tyres pressure (PSI)
    uint8     m_surfaceType[4];                // Driving surface, see appendices
};

struct PacketCarTelemetryData
{
    PacketHeader    	m_header;	       // Header

    CarTelemetryData    m_carTelemetryData[22];

    uint32              m_buttonStatus;        // Bit flags specifying which buttons are being pressed
                                               // currently - see appendices

    // Added in Beta 3:
    uint8               m_mfdPanelIndex;       // Index of MFD panel open - 255 = MFD closed
                                               // Single player, race – 0 = Car setup, 1 = Pits
                                               // 2 = Damage, 3 =  Engine, 4 = Temperatures
                                               // May vary depending on game mode
    uint8               m_mfdPanelIndexSecondaryPlayer;   // See above
    int8                m_suggestedGear;       // Suggested gear for the player (1-8)
                                               // 0 if no gear suggested
};

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
