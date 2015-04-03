var Hapi = require("hapi"),
    initServer = require('./controller/initServer.js'),
    path = require('path'),
    initRouters = require('./controller/initRouters.js');

global.APPROOT = path.resolve(__dirname);

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'view/static')
            }
        }
    }
});

initServer.execute(server);
initRouters.execute(server);

server.start();