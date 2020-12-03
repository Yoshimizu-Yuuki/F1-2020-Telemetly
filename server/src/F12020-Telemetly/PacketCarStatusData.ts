import {PacketHeader,getPacketHeader} from "./PacketHeader";

//タイヤ情報とかが入ってる。
interface CarStatusData
{
    m_tractionControl:Uint8Array;          // 0 (off) - 2 (high)
    m_antiLockBrakes:Uint8Array;           // 0 (off) - 1 (on)
    m_fuelMix:Uint8Array;                  // Fuel mix - 0 = lean, 1 = standard, 2 = rich, 3 = max
    m_frontBrakeBias:Uint8Array;           // Front brake bias (percentage)
    m_pitLimiterStatus:Uint8Array;         // Pit limiter status - 0 = off, 1 = on
    m_fuelInTank:Float32Array;               // Current fuel mass
    m_fuelCapacity:Float32Array;             // Fuel capacity
    m_fuelRemainingLaps:Float32Array;        // Fuel remaining in terms of laps (value on MFD)
    m_maxRPM:Uint16Array;                   // Cars max RPM, point of rev limiter
    m_idleRPM:Uint16Array;                  // Cars idle RPM
    m_maxGears:Uint8Array;                 // Maximum number of gears
    m_drsAllowed:Uint8Array;               // 0 = not allowed, 1 = allowed, -1 = unknown
    

    // Added in Beta3:
    m_drsActivationDistance:Uint16Array;    // 0 = DRS not available, non-zero - DRS will be available
                                            // in [X] metres
    
    m_tyresWear:Uint8Array[4];             // Tyre wear percentage [4]
    m_actualTyreCompound:Uint8Array;	    // F1 Modern - 16 = C5, 17 = C4, 18 = C3, 19 = C2, 20 = C1
   					    // 7 = inter, 8 = wet
   					    // F1 Classic - 9 = dry, 10 = wet
   					    // F2 – 11 = super soft, 12 = soft, 13 = medium, 14 = hard
   					    // 15 = wet
   m_visualTyreCompound:Uint8Array;        // F1 visual (can be different from actual compound)
                                            // 16 = soft, 17 = medium, 18 = hard, 7 = inter, 8 = wet
                                            // F1 Classic – same as above
                                            // F2 – same as above
    m_tyresAgeLaps:Uint8Array;             // Age in laps of the current set of tyres
    m_tyresDamage:Uint8Array[4];           // Tyre damage (percentage) [4]
    m_frontLeftWingDamage:Uint8Array;      // Front left wing damage (percentage)
    m_frontRightWingDamage:Uint8Array;     // Front right wing damage (percentage)
    m_rearWingDamage:Uint8Array;           // Rear wing damage (percentage)
    
    // Added Beta 3:
    m_drsFault:Uint8Array;                 // Indicator for DRS fault, 0 = OK, 1 = fault
    
    m_engineDamage:Uint8Array;             // Engine damage (percentage)
    m_gearBoxDamage:Uint8Array;            // Gear box damage (percentage)
    m_vehicleFiaFlags:Int8Array;          // -1 = invalid/unknown, 0 = none, 1 = green
                                            // 2 = blue, 3 = yellow, 4 = red
    m_ersStoreEnergy:Float32Array;           // ERS energy store in Joules
    m_ersDeployMode:Uint8Array;            // ERS deployment mode, 0 = none, 1 = medium
                                            // 2 = overtake, 3 = hotlap
    m_ersHarvestedThisLapMGUK:Float32Array;  // ERS energy harvested this lap by MGU-K
    m_ersHarvestedThisLapMGUH:Float32Array;  // ERS energy harvested this lap by MGU-H
    m_ersDeployedThisLap:Float32Array;       // ERS energy deployed this lap
};

interface PacketCarStatusData
{
    m_header:PacketHeader;           // Header

    m_carStatusData:CarStatusData[];
};