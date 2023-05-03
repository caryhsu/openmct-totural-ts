import * as express from 'express';
import 'express-ws';

import { Spacecraft, State } from "./spacecraft";
import expressWs from 'express-ws';

export function RealtimeServer(spacecraft: Spacecraft) {

    let router: expressWs.Router = express.Router();

    router.ws('/', function (ws) {
        let unlisten = spacecraft.listen(notifySubscribers);
        let subscribed: Record<string, boolean> = {}; // Active subscriptions for this connection
        let handlers : Record<string, any> = { // Handlers for specific requests
            subscribe: function (id: string) {
                subscribed[id] = true;
            },
            unsubscribe: function (id: string) {
                delete subscribed[id];
            }
        };

        function notifySubscribers(point: State) {
            if (subscribed[point.id]) {
                ws.send(JSON.stringify(point));
            }
        }

        // Listen for requests
        ws.on('message', function (message) {
            let parts = message.toString().split(' ');
            let handler = handlers[parts[0]];
            handler?.apply(handlers, parts.slice(1));
        });

        // Stop sending telemetry updates for this connection when closed
        ws.on('close', unlisten);
    });


    return router;
};

