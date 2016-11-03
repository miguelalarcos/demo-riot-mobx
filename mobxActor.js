import {observable, asMap, asReference} from 'mobx'

let ticket = 1

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
          let t = ticket++
          this.predicates[name].push({ticket: t, args: args})
          return {ticket: t, name: this.registered[name]}
        }
      }
    }
    else{
      let t = ticket++
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
    this.rollbacks = {}
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
        this.metadata.set(msg.predicate + ':' + msg.ticket, 'init')
        break
      case 'ready':
        this.metadata.set(msg.predicate + ':' + msg.ticket, 'ready')
        break
      case 'add':
        this.insert(this.getCollection(msg.predicate), msg.doc, msg.ticket)
        break
      case 'update':
        this.update(this.getCollection(msg.predicate), msg.doc, msg.ticket)
        break
      case 'delete':
        this.delete(this.getCollection(msg.predicate), msg.id, msg.ticket)
        break
      case 'rollback':
        let rollback = this.rollbacks[msg.id]
        if(rollback) {
          rollback()
          delete this.rollbacks[msg.id]
        }
        break
      case 'rpc':

        break
    }
  }

  insert(collection, doc, t=null){
    if(t) {
      let rollback = this.rollbacks[t]
      if(rollback) {
        rollback()
        delete this.rollbacks[t]
      }
      let aux = this.collections[collection].get(':'+t) || this.collections[collection].get(doc.id)
      let tickets = aux && aux.tickets || new Set()
      tickets.add(t)
      doc.tickets = tickets
      // doc.id = id
      this.collections[collection].set(doc.id, doc)
      this.collections[collection].delete(':'+t)
    }
    else{
      let t = ticket++
      // this.ws.insert(collection, doc, t)
      this.rollbacks[t] = () => this.collections[collection].delete(':'+t)
      let tickets = new Set()
      tickets.add(t)
      doc.tickets = tickets
      doc.id = ':'+t
      this.collections[collection].set(':'+t, doc)
    }
  }

  update(collection, doc, t=null){
    if(!t){
      this.ws.update(collection, doc, ticket++)
      let rollbackDoc = this.collections[collection].get(doc.id)
      this.rollbacks[doc.id] = () => this.collections[collection].set(doc.id, rollbackDoc)
    }
    else{
      let rollback = this.rollbacks[doc.id]
      if(rollback) {
        rollback()
        delete this.rollbacks[doc.id]
      }
    }
    doc.tickets = this.collections[collection].get(doc.id).tickets
    this.collections[collection].set(doc.id, doc)
  }

  delete(collection, id, t=null){
    if(!t){
      this.ws.delete(collection, id, ticket++)
      let rollbackDoc = this.collections[collection].get(id)
      this.rollbacks[id] = () => this.collections[collection].set(id, rollbackDoc)
    }
    else{
      let rollback = this.rollbacks[id]
      if(rollback) {
        rollback()
        delete this.rollbacks[id]
      }
    }
    this.collections[collection].delete(id)
  }

}

export const mbx = new mbxActor()
