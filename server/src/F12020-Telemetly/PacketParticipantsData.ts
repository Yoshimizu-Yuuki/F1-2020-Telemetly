import {PacketHeader,getPacketHeader} from "./PacketHeader";

//レースに参加しているドライバーの情報が入っています。
//レース中の更新は基本的にないので、他の情報を返すときに付随して返す感じが良いかも。m_nameは微妙に文字化けしてるので、teamIdとかm_driverIdで取得した方がよい。
//response用の型を作って、serverとclientで共有した方がよい。
export interface ParticipantData
{
    m_aiControlled:Uint8Array;           // Whether the vehicle is AI (1) or Human (0) controlled
    m_driverId:Uint8Array;               // Driver id - see appendix
    m_teamId:Uint8Array;                 // Team id - see appendix
    m_raceNumber:Uint8Array;             // Race number of the car
    m_nationality:Uint8Array;            // Nationality of the driver
    m_name:String;               // Name of participant in UTF-8 format – null terminated char[48]
                                         // Will be truncated with … (U+2026) if too long
    m_yourTelemetry:Uint8Array;          // The player's UDP setting, 0 = restricted, 1 = public
};

export interface PacketParticipantsData
{
    m_header:PacketHeader;           // Header

    m_numActiveCars:Uint8Array;	// Number of active cars in the data – should match number of
                                            // cars on HUD
    m_participants:ParticipantData[];
};


function getCarParticipantData(message:any):ParticipantData{
    return {
        m_aiControlled:message.readUInt8(0),
        m_driverId:message.readUInt8(1),
        m_teamId:message.readUInt8(2),
        m_raceNumber:message.readUInt8(3),
        m_nationality:message.readUInt8(4),
        m_name:message.toString('utf8', 5, 11),
        m_yourTelemetry:message.readUInt8(12),
    }
}

function getParticipantData(message:any):ParticipantData[]{
    //ヘッダー（24Byte）+m_numActiveCars（1Byte）を除くと54Byte×22台となる。
    const offset = 24+1;
    const size = 54;
    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((el,index)=>{
        return getCarParticipantData(message.slice(offset + index*size,offset + (index+1)*size));
    })
}

function getNumActiveCars(message:any):Uint8Array{
    //ヘッダー（24Byte）を除く
    const offset = 24;
    return message.readUInt8(offset);
}

export default function getPacketParticipantsData(message:any):PacketParticipantsData|null{
    if(message.byteLength === 1213){
        return {
            m_header:getPacketHeader(message),
            m_numActiveCars:getNumActiveCars(message),
            m_participants:getParticipantData(message)
        }
    }
    else{
        return null;
    }
}