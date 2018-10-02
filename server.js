// server.js
const net = require('net');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const port = 8100;
let seed = 0;
const DIR = process.env.DEFAULT_DIR;
const MAX_CONNECTIONS = parseInt(process.env.MAX_CONNECTIONS);
let connections = 0;


const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.id = Date.now() +"_seed"+ ++seed;
    client.logger = fs.createWriteStream(`client${client.id}.txt`);
    client.dir = DIR + client.id + path.sep;
    client.on('data', (data)=>{
        check_connectio_pool(client);
        my_writer(client, 'Client:'+ data);
        if(data === 'FILES') {
            fs.mkdir(client.dir, () => {});
            send_response(client, 'ACK');
        }else if(data === 'EXIT') {
            send_response(client, 'DEC');
        }else {
            write_file(client, data);
            send_response(client, 'Wait next file...');
        }
    });
    client.on('end', () => {
        my_writer(client, `Client №${client.id} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function check_connection_pool(client) {
    if(connections + 1 > MAX_CONNECTIONS){
        send_response(client, 'There are too much users!');
        client.destroy();
    }
}

function write_file(client, data) {
    let parts = data.split('FILE');
    let file = fs.createWriteStream(client.dir + parts[1]);
    file.write(parts[0]);
    file.close();
}

function send_response(client, message){
    my_writer(client, 'You: ' + message);
    client.write(message);
}

function my_writer(client, message){
    client.logger.write(message+'\n');
    console.log('You: ' + message);
}

