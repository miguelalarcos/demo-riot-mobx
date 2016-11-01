import {observable, asMap, asReference} from 'mobx'

let ticket = 1

class Predicates {
  constructor(){
    this.predicates = {}
    this.registered = {}
    //this.ticket = 1
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
    this.collections = {}
    this.metadata = observable(asMap())
    this.predicates = new Predicates()
  }

  newCollection(name){
    console.log(name)
    this.collections[name] = observable(asMap([], asReference))
  }

  register(predicate, coll){
    this.predicates.register(predicate, coll)
  }

  insert(collection, doc, ticket=null){
    if(ticket)
      doc.tickets = new Set([ticket])
    delete doc.ticket
    this.collections[collection].set(doc.id, doc)
  }

  update(collection, doc){
    this.collections[collection].set(doc.id, doc)
  }

  delete(collection, id){
    this.collections[collection].delete(id)
  }

}

export const mbx = new mbxActor()
