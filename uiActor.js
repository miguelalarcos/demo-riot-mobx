import _ from 'lodash'

class uiActor{
  constructor(){
    this.ws = null
    this.mbx = null
  }
}

export const ui = new uiActor()

export const UImixin = (self) => {
  return {
    ws: ui.ws,
    mbx: ui.mbx,
    subscribeDoc: (collection, id) => {
      // check if id exists in collection and update self.doc with that initial value
      ui.mbx.collections[collection].observe((change) => {
        if(change.newValue.id == id){
          self.doc = change.newValue
        }
      })
    },
    subscribePredicate: (predicate, args) => {
      let {ticket, name} = ui.mbx.predicates.getTicket(predicate, args)
      let collection = ui.mbx.collections[name]

      // maybe ticket is the only necessary argument
      if(ui.mbx.metadata[name + ':'  + ticket] == 'ready'){
        self._handle(ticket, collection)
      }
      else{
        const dispose = ui.mbx.metadata.observe((change) => {
          if(change.name == name + ':' + ticket && change.newValue == 'ready'){
            self._handle(ticket, collection)
            dispose()
          }
        })
      }
    },
    _handle: (ticket, collection) => {
      self.items = collection.values().filter((x)=> _.includes(x.tickets, ticket)) //x.ticket == ticket)
      collection.observe((change) => {
        //console.log(change)
        tickets = change.newValue && change.newValue.tickets || change.oldValue.tickets
        if(_.includes(tickets, ticket)){
            self.updateItems(change)
        }
      })
    },
    updateItems(change){
        let doc, pos
        switch (change.type) {
            case 'add':
                doc = change.newValue
                pos = self.index(doc)
                self.items.splice(pos, 0, doc)
                break;
            case 'update':
                doc = change.newValue
                pos = self.actualIndex(doc)
                self.items.splice(pos, 1)
                pos = self.index(doc)
                self.items.splice(pos, 0, doc)
                break;
            case 'delete':
                doc = change.oldValue
                pos = self.actualIndex(doc)
                self.items.splice(pos, 1)
                break;
        }

    },
    actualIndex: (doc) => {
        let i = 0
        for(let elem of self.items){
            if(doc.id == elem.id)
                return i
            i++
        }
    },
    index: (doc) => {
        let i = 0
        for(let elem of self.items){
            let v = self.sort(doc, elem)
            if(v == 1){
                return i
            }
            i++
        }
        return self.items.length
    },
    onclick: () => {
      let collection = ui.mbx.collections['collection']
      let metadata = ui.mbx.metadata
      
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
