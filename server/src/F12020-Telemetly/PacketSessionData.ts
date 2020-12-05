import { PacketHeader, getPacketHeader } from "./PacketHeader";

interface MarshalZone {
  m_zoneStart: Float32Array; // Fraction (0..1) of way through the lap the marshal zone starts
  m_zoneFlag: Int8Array; // -1 = invalid/unknown, 0 = none, 1 = green, 2 = blue, 3 = yellow, 4 = red
}

interface WeatherForecastSample {
  m_sessionType: Uint8Array; // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, 5 = Q1
  // 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ, 10 = R, 11 = R2
  // 12 = Time Trial
  m_timeOffset: Uint8Array; // Time in minutes the forecast is for
  m_weather: Uint8Array; // Weather - 0 = clear, 1 = light cloud, 2 = overcast
  // 3 = light rain, 4 = heavy rain, 5 = storm
  m_trackTemperature: Int8Array; // Track temp. in degrees celsius
  m_airTemperature: Int8Array; // Air temp. in degrees celsius
}

export interface PacketSessionData {
  m_header: PacketHeader; // Header

  m_weather: Uint8Array; // Weather - 0 = clear, 1 = light cloud, 2 = overcast
  // 3 = light rain, 4 = heavy rain, 5 = storm
  m_trackTemperature: Int8Array; // Track temp. in degrees celsius
  m_airTemperature: Int8Array; // Air temp. in degrees celsius
  m_totalLaps: Uint8Array; // Total number of laps in this race
  m_trackLength: Uint16Array; // Track length in metres
  m_sessionType: Uint8Array; // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P
  // 5 = Q1, 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ
  // 10 = R, 11 = R2, 12 = Time Trial
  m_trackId: Int8Array; // -1 for unknown, 0-21 for tracks, see appendix
  m_formula: Uint8Array; // Formula, 0 = F1 Modern, 1 = F1 Classic, 2 = F2,
  // 3 = F1 Generic
  m_sessionTimeLeft: Uint16Array; // Time left in session in seconds
  m_sessionDuration: Uint16Array; // Session duration in seconds
  m_pitSpeedLimit: Uint8Array; // Pit speed limit in kilometres per hour
  m_gamePaused: Uint8Array; // Whether the game is paused
  m_isSpectating: Uint8Array; // Whether the player is spectating
  m_spectatorCarIndex: Uint8Array; // Index of the car being spectated
  m_sliProNativeSupport: Uint8Array; // SLI Pro support, 0 = inactive, 1 = active
  m_numMarshalZones: Uint8Array; // Number of marshal zones to follow
  m_marshalZones: MarshalZone[]; // List of marshal zones – max 21 [21]
  m_safetyCarStatus: Uint8Array; // 0 = no safety car, 1 = full safety car
  // 2 = virtual safety car
  m_networkGame: Uint8Array; // 0 = offline, 1 = online
  m_numWeatherForecastSamples: Uint8Array; // Number of weather samples to follow
  m_weatherForecastSamples: WeatherForecastSample[]; // Array of weather forecast samples [20]
}

function getMarshalZone(message: any): MarshalZone {
  return {
    m_zoneStart: message.readFloatLE(0),
    m_zoneFlag: message.readInt8(4)
  };
}

function getMarshalZoneData(message: any): MarshalZone[] {
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

function getWeatherForecastSample(message: any): WeatherForecastSample {
  return {
    m_sessionType: message.readUInt8(0),
    m_timeOffset: message.readUInt8(1),
    m_weather: message.readUInt8(2),
    m_trackTemperature: message.readInt8(3),
    m_airTemperature: message.readInt8(4)
  };
}

function getWeatherForecastSampleData(message: any): WeatherForecastSample[] {
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
    return getWeatherForecastSample(
      message.slice(index * size, (index + 1) * size)
    );
  });
}

export default function getPacketSessionData(
  message: any
): PacketSessionData | null {
  const offset = 24;
  const marshal_offset = 105;
  const weather_offset = 105;
  if (message.byteLength === 251) {
    return {
      m_header: getPacketHeader(message),
      m_weather: message.readUInt8(offset + 0), // Weather - 0 = clear, 1 = light cloud, 2 = overcast
      m_trackTemperature: message.readInt8(offset + 1), // Track temp. in degrees celsius
      m_airTemperature: message.readInt8(offset + 2), // Air temp. in degrees celsius
      m_totalLaps: message.readUInt8(offset + 3), // Total number of laps in this race
      m_trackLength: message.readInt16LE(offset + 4), // Track length in metres
      m_sessionType: message.readUInt8(offset + 6), // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P
      // 5 = Q1, 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ
      // 10 = R, 11 = R2, 12 = Time Trial
      m_trackId: message.readInt8(offset + 7), // -1 for unknown, 0-21 for tracks, see appendix
      m_formula: message.readUInt8(offset + 8), // Formula, 0 = F1 Modern, 1 = F1 Classic, 2 = F2,
      // 3 = F1 Generic
      m_sessionTimeLeft: message.readInt16LE(offset + 9), // Time left in session in seconds
      m_sessionDuration: message.readInt16LE(offset + 11), // Session duration in seconds
      m_pitSpeedLimit: message.readUInt8(offset + 13), // Pit speed limit in kilometres per hour
      m_gamePaused: message.readUInt8(offset + 14), // Whether the game is paused
      m_isSpectating: message.readUInt8(offset + 15), // Whether the player is spectating
      m_spectatorCarIndex: message.readUInt8(offset + 16), // Index of the car being spectated
      m_sliProNativeSupport: message.readUInt8(offset + 17), // SLI Pro support, 0 = inactive, 1 = active
      m_numMarshalZones: message.readUInt8(offset + 18), // Number of marshal zones to follow
      m_marshalZones: getMarshalZoneData(
        message.slice(offset + 19, offset + marshal_offset + 19)
      ),
      m_safetyCarStatus: message.readUInt8(offset + marshal_offset + 19), // 0 = no safety car, 1 = full safety car
      // 2 = virtual safety car
      m_networkGame: message.readUInt8(offset + marshal_offset + 20), // 0 = offline, 1 = online
      m_numWeatherForecastSamples: message.readUInt8(
        offset + marshal_offset + 21
      ), // Number of weather samples to follow
      m_weatherForecastSamples: getWeatherForecastSampleData(
        message.slice(
          offset + marshal_offset + 22,
          offset + marshal_offset + weather_offset + 22
        )
      )
    };
  } else {
    return null;
  }
}
