import getPacketLapData from "./F12020-Telemetly/PacketLapData";
import getPacketParticipantsData,{ParticipantData} from "./F12020-Telemetly/PacketParticipantsData";

import express from 'express'
const cors = require('cors')
const app: express.Express = express()


var PORT:Number = 22020;
var HOST:String = '127.0.0.1';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

//グローバル変数を使う方法で見事にデータを取得成功。nodeのプロセス的には変数を共有しているっぽい。
var dengelos:ParticipantData[] | null;

server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message:Buffer, remote:any) {
    // if(message.byteLength==1190){
        // const result = getPacketLapData(message);
        // console.log(result?result.m_lapData[0].m_sector:"なにもない");
    // }else if(message.byteLength == 1213){
    if(message.byteLength == 1213){
        const result = getPacketParticipantsData(message);
        dengelos = result?result.m_participants:null;
    }
});

server.bind(PORT, HOST);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const router: express.Router = express.Router()
router.get('/', (req:express.Request, res:express.Response) => {
  res.send(JSON.stringify({status:200,data:dengelos}));
})

app.use(router)

// 3000番ポートでAPIサーバ起動
app.listen(3020,()=>{ console.log('Example app listening on port 3020!') })