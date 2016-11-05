import Q from 'q'
import {T} from './TicketActor.js'

class ActionActor{
    constructor(){
        this.promises = {}
        this.ws = null
    }

    rpc(method, ...args){
        doc = {}
        doc.type = method
        doc.args = args
        let t = T.getTicket()
        let deferred = Q.defer()
        this.promises[t] = deferred
        doc.ticket = t
        this.ws.rpc(doc)
        return deferred.promise
    }

    notify(msg){
        this.promises[msg.ticket].resolve(msg.value)
    }
}

export const aa = new ActionActor()
