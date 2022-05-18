const path = require("path");

function utils_normalizePath(path_string){
    
    return path.join(path_string.split(path.sep).join())

}

module.exports = utils_normalizePath;