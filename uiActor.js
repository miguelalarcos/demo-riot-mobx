import _ from 'lodash'

class uiActor{
  constructor(){
    this.mbx = null
  }
}

export const ui = new uiActor()

export const UImixin = (self) => {
  return {
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
      if(ui.mbx.metadata[predicate + ':'  + ticket] == 'ready'){
        self.handle(ticket, collection)
      }
      else{
        const dispose = ui.mbx.metadata.observe((change) => {
          if(change.name == predicate + ':' + ticket && change.newValue == 'ready'){
            self.handle(ticket, collection)
            dispose()
          }
        })
      }
    },
    handle: (ticket, collection) => {
      console.log(collection.values(), ticket)
      self.items = collection.values().filter((x)=> _.includes([...x.tickets], ticket))
        self.update()
      collection.observe((change) => {
        console.log(change.newValue)
        let tickets = change.newValue && change.newValue.tickets || change.oldValue.tickets
        if(_.includes([...tickets], ticket)){
            self.updateItems(change)
            self.update()
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
                this.update()
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
            let v = self.sortCmp(doc, elem)
            if(v == 1){
                return i
            }
            i++
        }
        return self.items.length
    },
  }
}
