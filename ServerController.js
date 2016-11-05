class Controller{
    constructor(ws, conn){
        this.ws = ws
        this.conn = conn
        this.cursors = []
    }
    notify(msg){
        console.log(msg)
        msg = JSON.parse(msg)
        if(msg.type == 'subscribe'){
            this.handle_subscribe(msg.predicate, msg.args, msg.ticket)
        }
        else{
            this.handle_rpc('rpc_' + msg.type, msg.args, msg.ticket)
        }
    }
    handle_rpc(command, args, ticket){
        let ret = {ticket: ticket, type: 'rpc'}
        this['rpc_' + command](...args, (val)=>{
            ret.data=val
            this.ws.send(JSON.stringify(ret))
        })
    }
    handle_subscribe(predicate, args, ticket){
        let ret = {ticket: ticket, type: 'subscribe'}
        let pred = this['subs_' + predicate](...args)
        pred.changes({includeInitial: true}).run(this.conn, (err, cursor)=>{
            this.cursors.push(cursor)
            cursor.each((err, data)=>{
                ret.data=data
                ret.predicate = predicate
                this.ws.send(JSON.stringify(ret))}
            )
            // cursor.on('data', (change) => {ret.data=change; this.ws.send(JSON.stringify(ret))})
        })
    }
    rpc_insert(collection, doc, callback){
        r.table(collection).insert(doc).run(this.conn).then((doc)=>callback(doc.generated_keys[0]))
    }
    rpc_update(collection, id, doc, callback){
        r.table(collection).get(id).update(doc).run(this.conn).then((doc)=>callback(doc.replaced))
    }
    close(){
        for(let c of this.cursors){
            c.close()
        }
        console.log('close')}
}

module.exports.Controller = Controller