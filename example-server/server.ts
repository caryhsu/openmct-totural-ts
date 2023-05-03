import { Spacecraft } from "./spacecraft";
import { RealtimeServer } from "./realtime-server";
import { HistoryServer } from "./history-server";
import { StaticServer } from "./static-server";

import express from 'express';
import expressWs from 'express-ws';


let inst = expressWs(express());
let app = inst.app;

let spacecraft = new Spacecraft();

let realtimeServer = RealtimeServer(spacecraft);
let historyServer = HistoryServer(spacecraft);
let staticServer = StaticServer();

app.use('/realtime', realtimeServer);
app.use('/history', historyServer);
app.use('/', staticServer);

let port = process.env.PORT || 8080

app.listen(port, function () {
    console.log('Open MCT hosted at http://localhost:' + port);
    console.log('History hosted at http://localhost:' + port + '/history');
    console.log('Realtime hosted at ws://localhost:' + port + '/realtime');
});