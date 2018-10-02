// server.js
const net = require('net');
const fs = require('fs');
const port = 8100;
let seed = 0;


const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.id = Date.now() +"_seed"+ ++seed;
    client.logger = fs.createWriteStream(`client${client.id}.txt`);
    client.on('quiz', (quiz)=>{
        console.log('sss');
    });
    client.on('data', (data)=>{
        // console.log('Client:'+data);
        my_writer(client, 'Client:'+ data);
        if(data === 'QA') {
            send_response(client, 'ACK');
        }else{
            send_answer(client, data);
        }
    });
    client.on('end', () => my_writer(client, `Client №${client.id} disconnected`));
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function send_answer(client, message){
    if(/q:.*/.test(message)){
        let rand = Math.random() * (3);
        rand = Math.ceil(rand);
        send_response(client, rand.toString());
    }
}

function send_response(client, message){
    my_writer(client, 'You: ' + message);
    client.write(message);
}

function my_writer(client, message){
    client.logger.write(message+'\n');
    console.log('You: ' + message);
}

