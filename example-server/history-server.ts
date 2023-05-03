import * as express from 'express';
import {Spacecraft, State} from "./spacecraft";


export function HistoryServer(spacecraft : Spacecraft) {
    
    let router : express.Router = express.Router();

    router.get('/:pointId', function (req, res) {
        let start = req.query.start ? +req.query.start : 0;
        let end = req.query.end ? +req.query.end : 0;
        const ids = req.params.pointId.split(',');

        let response = ids.reduce(function (resp, id) {
            return resp.concat(this.spacecraft.history[id].filter(function (p) {
                return p.timestamp > start && p.timestamp < end;
            }));
        }, []);
        res.status(200).json(response).end();
    });

    return router;

}

