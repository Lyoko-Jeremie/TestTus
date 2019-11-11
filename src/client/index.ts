// import "../appPolyfill"
import {Upload} from 'tus-js-client'
import fs from 'fs'


// import debug from 'debug'
//
// debug('aaa')('asdasd');
// process.exit(0);


// const p = 'd:\\Code\\glm-0.9.9.5.7z';
// const p = 'd:\\Download\\qt-opensource-windows-x86-5.12.3.exe';
// const p = 'd:\\Download\\tigervnc64-1.9.0.exe';
const p = 'd:\\Download\\VMware-workstation-full-15.1.0-13591040.exe';
const f = fs.createReadStream(p);
const s = fs.statSync(p).size;

const u = new Upload(f, {
    endpoint: 'http://127.0.0.1:3000/uploads',
    resume: true,
    metadata: {
        filename: "README.md",
        filetype: "text/plain",
    },
    uploadSize: s,
    onError: function (error) {
        throw error;
    },
    onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
        console.log('onProgress:', bytesUploaded, bytesTotal, percentage + "%");
    },
    onSuccess: function () {
        console.log("Upload finished:", u.url);
    }
});

u.start();
