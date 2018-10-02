const fs = require('fs');
const path = require('path');
//можно через module.esports = определение ф-ии с телом;
const service = {};
service.files = [];

service.parser = function(dir) {
    fs.readdir(dir, function(err, items) {
        for (let i = 0; i < items.length; i++) {
            service.check_file_type(dir + items[i]);
        }
    });
    return service.files;
};
service.check_file_type = function(object_name){
    fs.stat(object_name, (err, obj)=> {
        if (!obj.isDirectory()) {
            service.parseFile(object_name);
        }
    })
};
service.parseFile = function(file_name){
    if(/.*\.txt/.test(file_name)){
        service.files.push(file_name);
    }
};
module.exports = service;