import * as express from 'express';

export function StaticServer() {
    let router = express.Router();
    router.use('/', express.static(__dirname + '/..'));
    return router
}

