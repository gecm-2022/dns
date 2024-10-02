const dgram = require("node:dgram")

const dnspacket = require('dns-packet')
const server = dgram.createSocket('udp4')
const db =
{
    'e-mess-modasa.site': {
        type: 'A',
        data: '21.21.21.12',
    },
    'kem.in': {
        type: 'A',
        data: '12.3.4.5',
    },

}

server.on('message', (msg, rinfo) => {
    const incomingReq = dnspacket.decode(msg)
    // console.log({
    //     mes: incomingReq.questions[0].name,
    //     rinfo
    // });

    const ipFromdb = db[incomingReq.questions[0].name]
    if (ipFromdb) {

        console.log(ipFromdb)
        const ans = dnspacket.encode(
            {
                type: 'response',
                id: incomingReq.id,
                flags: dnspacket.AUTHORITATIVE_ANSWER,
                questions: incomingReq.questions,
                answers: [{
                    type: ipFromdb.type,
                    class: "A",
                    name: incomingReq.questions[0].name,
                    data: ipFromdb.data
                }]
            }
        )
        server.send(ans, rinfo.port, rinfo.address)
    }

})
server.bind(53, () => console.log('dns server run in port 53'))