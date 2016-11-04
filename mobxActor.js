import {observable, asMap, asReference} from 'mobx'
import {T} from './TicketActor.js'

class Predicates {
  constructor(){
    this.predicates = {}
    this.registered = {}
  }

  register(predicate, collection){
    this.registered[predicate] = collection
  }

  getTicket(name, args={}){
    let p = this.predicates[name]
    if(p){
      for(p of p){
        if(_.isEqual(args, p.args)){
          return {ticket: p.ticket, name: this.registered[name]}
        }else{
          let t = T.getTicket()
          this.predicates[name].push({ticket: t, args: args})
          return {ticket: t, name: this.registered[name]}
        }
      }
    }
    else{
      let t = T.getTicket()
      this.predicates[name] = [{ticket: t, args: args}]
      return {ticket: t, name: this.registered[name]}
    }
  }
}

class mbxActor{
  constructor(){
    this.ws = null
    this.collections = {}
    this.metadata = observable(asMap())
    this.predicates = new Predicates()
    this.promises = {}
  }

  subscribe(predicate, args){
    console.log('yahoo!')
    this.ws.subscribe(predicate, args)
    let {ticket, name} = this.predicates.getTicket(predicate, args)
    let collection = this.collections[name]
    return {ticket, collection}
  }

  newCollection(name){
    this.collections[name] = observable(asMap([], asReference))
  }

  register(predicate, coll){
    this.predicates.register(predicate, coll)
  }

  getCollection(predicate){
    return this.predicates.registered[predicate] || predicate
  }

  clear(collection){
    this.collections[collection].clear()
  }

  clearTicket(){
    ticket = 1
  }

  notify(msg){
    switch(msg.type){
      case 'init':
        this.metadata.set(''+msg.ticket, 'init')
        break
      case 'ready':
        this.metadata.set(''+msg.ticket, 'ready')
        break
      case 'add':
        this.insert(this.getCollection(msg.predicate), msg.doc, msg.ticket)
        break
      case 'update':
        this.update(this.getCollection(msg.predicate), msg.doc, msg.ticket)
        break
      case 'delete':
        this.delete(this.getCollection(msg.predicate), msg.id)
        break
    }
  }

  insert(collection, doc, t){
    let aux = this.collections[collection].get(':'+t) || this.collections[collection].get(doc.id)
    let tickets = aux && aux.tickets || new Set()
    tickets.add(t)
    doc.tickets = tickets
    this.collections[collection].set(doc.id, doc)
    this.collections[collection].delete(':'+t)
  }

  update(collection, doc, t){
    doc.tickets = this.collections[collection].get(doc.id).tickets
    this.collections[collection].set(doc.id, doc)
  }

  delete(collection, id){
    this.collections[collection].delete(id)
  }

}

export const mbx = new mbxActor()
