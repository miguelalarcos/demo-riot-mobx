import Q from 'q'
import {T} from './TicketActor.js'

class ActionActor{
    constructor(){
        this.promises = {}
        this.ws = null
    }

    rpc(method, data){
        let t = T.getTicket()
        let deferred = Q.defer()
        this.promises[t] = deferred
        this.ws.rpc(method, data, t)
        return deferred.promise
    }

    notify(msg){
        this.promises[msg.ticket].resolve(msg.value)
    }
}

export const aa = new ActionActor()
