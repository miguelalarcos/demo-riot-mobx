import riot from 'riot'
import _ from 'lodash'
import {collections, metadata, newCollection} from './core.js'
import {asReference, isObservable} from 'mobx'

class Predicates {
  constructor(){
    this.predicates = {}
    this.registered = {}
    this.ticket = 1
  }

  register(predicate, collection){
    this.registered[predicate] = collection
  }

  subscribe(name, args={}){
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

export const P = new Predicates()

export const getDocObserverMixin = (self) => {
  return {
    subscribe: (collection, id) => {
      // check if id exists in collection and update self.doc with that initial value
      collections[collection].observe((change) => {
        if(change.newValue.id == id){
          self.doc = change.newValue
        }
      })
    }
  }
}

export const getPredicateObserverMixin = (self) => {
  return {
    init: () => {
    },

    subscribe: (predicate, args) => {
      let {ticket, name} = P.subscribe(predicate, args)
      let collection = collections[name]

      if(metadata[name + ':'  + ticket] == 'ready'){
        self.handle(ticket, collection)
      }
      else{
        const dispose = metadata.observe((change) => {
          if(change.name == name + ':' + ticket && change.newValue == 'ready'){
            self.handle(ticket, collection)
            dispose()
          }
        })
      }
    },

    handle: (ticket, collection) => {
      self.items = collection.values().filter((x)=>x.ticket == ticket)
      collection.observe((change) => {
        console.log(change)
        if(change.newValue.ticket == ticket)
          self.items.push({id: change.newValue.id, a: change.newValue.a})
      })
    },

    onclick: () => {
      let collection = collections['collection']
      metadata.set('collection:1', 'init')
      collection.set('0', {id:'0', a: 0, ticket: 1})
      collection.set('1', {id:'1', a: 1, ticket: 2})
      collection.set('2', {id:'2', a: 2, ticket: 1})

      metadata.set('collection:1', 'ready')
      collection.set('3', {id:'3', a: 3, ticket: 1})
      collection.set('4', {id:'4', a: 4, ticket: 2})
      collection.set('5', {id:'5', a: 5, ticket: 1})
      console.log('---')
      console.log(isObservable(collection.get('5')))
    }
  }
}
