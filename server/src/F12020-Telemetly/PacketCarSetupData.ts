import { PacketHeader, getPacketHeader } from "./PacketHeader";

//セットアップが丸見え！
interface CarSetupData
{
    m_frontWing:Uint8Array;                // Front wing aero
    m_rearWing:Uint8Array;                 // Rear wing aero
    m_onThrottle:Uint8Array;               // Differential adjustment on throttle (percentage)
    m_offThrottle:Uint8Array;              // Differential adjustment off throttle (percentage)
    m_frontCamber:Float32Array;              // Front camber angle (suspension geometry)
    m_rearCamber:Float32Array;               // Rear camber angle (suspension geometry)
    m_frontToe:Float32Array;                 // Front toe angle (suspension geometry)
    m_rearToe:Float32Array;                  // Rear toe angle (suspension geometry)
    m_frontSuspension:Uint8Array;          // Front suspension
    m_rearSuspension:Uint8Array;           // Rear suspension
    m_frontAntiRollBar:Uint8Array;         // Front anti-roll bar
    m_rearAntiRollBar:Uint8Array;          // Front anti-roll bar
    m_frontSuspensionHeight:Uint8Array;    // Front ride height
    m_rearSuspensionHeight:Uint8Array;     // Rear ride height
    m_brakePressure:Uint8Array;            // Brake pressure (percentage)
    m_brakeBias:Uint8Array;                // Brake bias (percentage)
    m_rearLeftTyrePressure:Float32Array;     // Rear left tyre pressure (PSI)
    m_rearRightTyrePressure:Float32Array;    // Rear right tyre pressure (PSI)
    m_frontLeftTyrePressure:Float32Array;    // Front left tyre pressure (PSI)
    m_frontRightTyrePressure:Float32Array;   // Front right tyre pressure (PSI)
    m_ballast:Uint8Array;                  // Ballast
    m_fuelLoad:Float32Array;                 // Fuel load
};

export interface PacketCarSetupData
{
    m_header:PacketHeader;            // Header

    m_carSetups:CarSetupData[];
};



function getCarSetupData(message: any): CarSetupData {
    return {
        m_frontWing:message.readUInt8(0),
        m_rearWing:message.readUInt8(1),
        m_onThrottle:message.readUInt8(2),
        m_offThrottle:message.readUInt8(3),
        m_frontCamber:message.readFloatLE(4),
        m_rearCamber:message.readFloatLE(8),
        m_frontToe:message.readFloatLE(12),
        m_rearToe:message.readFloatLE(16),
        m_frontSuspension:message.readUInt8(20),
        m_rearSuspension:message.readUInt8(21),
        m_frontAntiRollBar:message.readUInt8(22),
        m_rearAntiRollBar:message.readUInt8(23),
        m_frontSuspensionHeight:message.readUInt8(24),
        m_rearSuspensionHeight:message.readUInt8(25),
        m_brakePressure:message.readUInt8(26),
        m_brakeBias:message.readUInt8(27),
        m_rearLeftTyrePressure:message.readFloatLE(28),
        m_rearRightTyrePressure:message.readFloatLE(32),
        m_frontLeftTyrePressure:message.readFloatLE(36),
        m_frontRightTyrePressure:message.readFloatLE(40),
        m_ballast:message.readUInt8(44),
        m_fuelLoad:message.readFloatLE(45),
    };
  }
  
  //1102Byte
  function getSetupData(message: any): CarSetupData[] {
    //ヘッダー（24Byte）を除くと60Byte×22台となる。
    const offset = 24;
    const size = 49;
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
      return getCarSetupData(
        message.slice(offset + index * size, offset + (index + 1) * size)
      );
    });
  }
  
  export default function getPacketCarSetupData(
    message: any
  ): PacketCarSetupData | null {
    if (message.byteLength === 1102) {
      return {
        m_header: getPacketHeader(message),
        m_carSetups: getSetupData(message)
      };
    } else {
      return null;
    }
  }
  