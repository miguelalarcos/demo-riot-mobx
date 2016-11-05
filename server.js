const Controller = require('./ServerController.js').Controller
const ServerActor = require('./ServerActor.js').ServerActor
const RethinkActor = require('./RethinkActor.js').RethinkActor

class MyServer extends Controller{
    rpc_add(a,b, callback){callback(a+b)}
    subs_a(){return r.table('collectionA')}
}

const sa = new ServerActor(MyServer)
const ra = new RethinkActor()
sa.ra = ra
ra.sa = sa

ra.start()
sa.start()