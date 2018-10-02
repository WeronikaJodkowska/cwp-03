const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8003;
let service = require('./files_parser');

process.argv.slice(2).forEach((dir)=>{
    service.parser(dir);
});

const client = new net.Socket();
client.setEncoding('utf8');
client.connect(port, ()=> {
    send_request('FILES');
});

client.on('data', (data)=>{
    console.log('Server: ' + data);
    if(data === 'DEC') {
        client.destroy();
    }else{
        share_files(data);
    }
});

function share_files(data){
    if(data=='ACK' || /Wait.*/.test(data)) {
        if (!service.files.length<1){
            send_file();
        }else{
            send_request('EXIT');
        }
    }
}

function send_file(){
    let file_name = service.files.pop();
    fs.readFile(file_name, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            send_request(data + 'FILE' + path.basename(file_name));
        }
    });
}

function send_request(message){
    client.write(message);
    console.log('You: ' + message);
}

client.on('close', function() {
    console.log('Connection closed');
});