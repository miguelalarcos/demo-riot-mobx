r = require('rethinkdb')
//mobx = require('mobx')

class RethinkActor{
    constructor(){
        this.sa = null
        // this.conn =  mobx.observable(null)
    }
    start(){
        r.connect().then((conn)=>{
            //this.conn.set(conn)
            this.sa.setConnection(conn)
        })
    }
}

module.exports.RethinkActor = RethinkActor

