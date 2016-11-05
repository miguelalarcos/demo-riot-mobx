import mobx from 'mobx'
import _ from 'lodash'

class wsActor{
    constructor(){
        this.mbx = null
        this.aa = null
        // setTimeout(this.setup.bind(this), 1000)
        this.connected = mobx.observable(false)
        this.offline = {}
        this.statePredicates = {}
        this.ws = null
    }
    _setup(){
        console.log('setup')
        this.mbx.notify({type: 'init', ticket: 1})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'0', a: 0}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 2, doc: {id:'1', a: 1}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'2', a: 2}})

        this.mbx.notify({type: 'ready', ticket: 1})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'3', a: 3}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 2, doc: {id:'4', a: 4}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'5', a: 5}})
    }

    send(obj){
        this.ws.send(JSON.stringify(msg))
    }

    subscribe(predicate, args, ticket){
        this.statePredicates[ticket] = {predicate, args}
        this.send({type: 'subscribe', predicate, args, ticket})
    }

    unsubscribe(ticket){
        delete this.statePredicates[ticket]
        //
    }

    start(){
        this.connect()
    }

    connect(){
        this.ws = new WebSocket('ws://' + document.location.hostname + ':8000')
        this.ws.onopen = () => this.onopen()
        this.ws.onmessage = (e) => this.onmessage(e.data)
        this.ws.onclose = (e) => {setTimeout(this.connect.bind(this), 5000)}
        this.ws.onerror = (e) => console.log('error', e)
    }

    onopen(){
        this.connected.set(true)
        keys = _.keys(this.offline)
        for(k of keys){
            doc = this.offline[k]
            if(!doc.id){
                this.send({type: 'update', ticket: ticket, args: args})
            }else{
                this.send({type: 'add', ticket: ticket, args: args})
            }
            delete this.offline[k]
        }
        keys = _.keys(this.statePredicates)
        for(k of keys) {
            pred = this.statePredicates[key]
            //
        }
    }

    onmessage(msg){
        obj = JSON.parse(msg)
        if(_.includes(['add', 'update', 'delete'], msg.type)){
            this.mbx.notify(obj)
        }
        else{
            this.aa.notify(obj)
        }
    }

    onerror(){}

    onclose(){
        this.connected.set(false)
    }

    rpc(doc){
        if(!this.connected.get()){
            method = doc.method
            args = doc.args
            doc = args.doc
            if(method == 'add'){
                this.offline[ticket] = doc
            }else if(method == 'update'){
                id = doc.id || ticket
                this.offline[id] = doc
            }else if(method == 'delete'){
                id = doc.id || ticket
                delete this.offline[id]
            }
        }else{
            this.send(doc)
        }
    }

    result(ticket, data){
        this.aa.notify({type: 'rpc', ticket: ticket, value: 1})
        this.mbx.notify({type: 'update', predicate: 'predicateA', ticket: 1, doc: data})
    }

}

export const ws = new wsActor()

