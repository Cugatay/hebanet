const axios = require('axios')

const keys = require('./storageKeys')

// Bytes are required because this function creates a new file or updates the loaded file
function uploadFile(file){
    return new Promise((res, rej) => {
        axios.post(keys.url + "/upload", {file: 'asd'})
        .then(result => {
            console.log(result.data)
            res(result)
        })
    })
}

// Bytes are not required because this function is gets the intended file
function downloadFile({file, getUrl}){
    return new Promise((res, rej) => {
        axios.post(`${keys.url}/download/${file}`, {username: keys.username, password: keys.password, getUrl})
        .then(result => {
            //console.log(result.data)
            res(result.data)
        })
    })
}

// Bytes are not required because this function is deletes the instended file
function deleteFile(file){

}

module.exports = {uploadFile, downloadFile, deleteFile}