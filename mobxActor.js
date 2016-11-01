import {observable, asMap, asReference} from 'mobx'

const collections = {}
const metadata = observable(asMap())

class Predicates {
  constructor(){
    this.predicates = {}
    this.registered = {}
    this.ticket = 1
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
          let t = this.ticket++
          this.predicates[name].push({ticket: t, args: args})
          return {ticket: t, name: this.registered[name]}
        }
      }
    }
    else{
      let t = this.ticket++
      this.predicates[name] = [{ticket: t, args: args}]
      return {ticket: t, name: this.registered[name]}
    }
  }
}

class mbxActor{
  constructor(){
    this.collections = collections
    this.metadata = metadata
    this.predicates = new Predicates()
  }

  newCollection(name){
    this.collections[name] = observable(asMap([], asReference))
  }

  register(predicate, coll){
    this.predicates.register(predicate, coll)
  }
}

export const mbx = new mbxActor()
