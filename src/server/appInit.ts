import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import debug from 'debug'
// import enableWs from "express-ws";

const expressApp = express();
// export const expressWsApp = enableWs(expressApp);
// const app = expressWsApp.app;
const app = expressApp;

app.use(logger('dev'));


// tus-server begin ======================
import moment from 'moment';
import {parseInt, ceil, floor} from 'lodash';
import {TusServer, FileStore, MongoGridFSStore, EVENTS} from 'tus-node-server';

const tusLogger = debug('tusLogger');
const tusLoggerProgress = debug('tusLogger:Progress');

const tusServer = new TusServer();
// tusServer.datastore = new FileStore({
//     path: '/tempTestFiles',
//     relativeLocation: true,
//     pipListenerConfig: {
//         dontSendProgressDuringNoData: true,
//     },
// });

// Connection URL
// https://stackoverflow.com/questions/50448272/avoid-current-url-string-parser-is-deprecated-warning-by-setting-usenewurlpars
// format : mongodb://username:passwd@host:port
const MongoUrl = process.env.mongodbURL
    || 'mongodb://username:passwd@host:port';
const databaseName = 'testGFS';
const bucketName = 'testBucket';
tusServer.datastore = new MongoGridFSStore({
    path: '/tempTestFiles',
    relativeLocation: true,
    uri: MongoUrl,
    db: databaseName,
    bucket: bucketName,
    pipListenerConfig: {
        dontSendProgressDuringNoData: true,
    },
});
tusServer.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
    tusLogger(`Upload complete for file ${JSON.stringify(event)}`);
});
tusServer.on(EVENTS.EVENT_FILE_CREATED, (event) => {
    tusLogger(`file create for file ${JSON.stringify(event)}`);
});
tusServer.on(EVENTS.EVENT_ENDPOINT_CREATED, (event) => {
    tusLogger(`endpoint create for file ${JSON.stringify(event)}`);
});
tusServer.on(EVENTS.EVENT_CHUNK_UPLOADED, (event) => {
    tusLogger(`uploading CHUNK UPLOADED ${JSON.stringify(event)}`);
    if (event.progress) {
        const value = event.progress;
        const timeleftA = moment.duration(value.averageTimeLeft, 'milliseconds');
        const timeleft = moment.duration(value.timeLeft, 'milliseconds');
        tusLoggerProgress('' + ceil(value.percentage, 2) + ' %'
            // + '\t' + ceil(value.averageSpeed, 2) + ' byte/s'
            // + '\t' + ceil(value.averageSpeed / 1024.0, 2) + ' KB/s'
            + '\t' + ceil(value.averageSpeed / 1024.0 / 1024.0, 2) + ' MB/s'
            // + '\t' + ceil(value.speed, 2) + ' byte/s'
            // + '\t' + ceil(value.speed / 1024.0, 2) + ' KB/s'
            + '\t' + ceil(value.speed / 1024.0 / 1024.0, 2) + ' MB/s'
            + '\t' + ceil(value.nowSpeed / 1024.0 / 1024.0, 2) + ' MB/s'

            + '\t' + ceil(value.averageTimeLeft) + ' ms'
            + '\t'
            + floor(timeleftA.asDays()) + ':'
            + floor(timeleftA.asHours()) % 24 + ':'
            + floor(timeleftA.asMinutes()) % 60 + ':'
            + timeleftA.seconds()
            + '\t' + ceil(value.timeLeft) + ' ms'
            + '\t'
            + floor(timeleft.asDays()) + ':'
            + floor(timeleft.asHours()) % 24 + ':'
            + floor(timeleft.asMinutes()) % 60 + ':'
            + timeleft.seconds()
        );
    }
});
const uploadApp = express();
uploadApp.all('*', tusServer.handle.bind(tusServer));
app.use('/uploads', uploadApp);
// tus-server end ======================


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

// https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50m'}));

app.use(express.static(path.join(__dirname, 'public')));


export default app;
