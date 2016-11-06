import mobx from 'mobx'
import _ from 'lodash'
import {Actor} from './Actor.js'


class WebSocketActor extends Actor{

    constructor(){
        super()
        this.mbx = null
        this.aa = null
        this.connected = mobx.observable(false)
        this.offline = {}
        this.statePredicates = {}
        this.ws = null
        this.pending = []
    }

    send(obj){
        console.log('send', JSON.stringify(obj))
        if(!this.connected.get()){
            this.pending.push(obj)
        }
        else {
            this.ws.send(JSON.stringify(obj))
        }
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
        self = this
        console.log('connecting...')
        this.ws = new WebSocket('ws://' + document.location.hostname + ':8000')
        this.ws.onopen = () => this.onopen()
        this.ws.onmessage = (e) => this.onmessage(e.data)
        this.ws.onclose = (e) => this.close()
        this.ws.onerror = (e) => console.log('error', e)
    }

    onopen(){
        this.connected.set(true)
        while(this.pending.length){
            let obj = this.pending.shift()
            this.send(obj)
        }
        let keys = _.keys(this.offline)
        for(let k of keys){
            doc = this.offline[k]
            if(!doc.id){
                this.send({type: 'update', ticket: ticket, args: args})
            }else{
                this.send({type: 'add', ticket: ticket, args: args})
            }
            delete this.offline[k]
        }
        keys = _.keys(this.statePredicates)
        for(let key of keys) {
            let pred = this.statePredicates[key]
            //
        }
    }

    onmessage(msg){
        let obj = JSON.parse(msg)
        if(_.includes(['add', 'update', 'delete', 'initializing', 'ready'], obj.type)){
            this.mbx.notify(obj)
        }
        else{
            this.aa.notify(obj)
        }
    }

    onerror(){}

    onclose(){
        setTimeout(this.connect.bind(this), 5000)
        this.connected.set(false)
    }

    rpc(doc){
        console.log('rpc', doc)
        if(!this.connected.get()){
            let method = doc.method
            let args = doc.args
            let doc = args.doc
            let id
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
}

export const ws = new WebSocketActor()

