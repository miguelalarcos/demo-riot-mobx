class wsActor{
    constructor(){
        this.mbx = null
        this.aa = null
        setTimeout(this.setup.bind(this), 1000);
    }
    setup(){
        console.log('setup')
        this.mbx.notify({type: 'init', ticket: 1})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'0', a: 0}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 2, doc: {id:'1', a: 1}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'2', a: 2}})

        this.mbx.notify({type: 'ready', ticket: 1})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'3', a: 3}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 2, doc: {id:'4', a: 4}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'5', a: 5}})
    }

    subscribe(predicate, args){
        console.log(predicate, args)
    }

    rpc(method, data, ticket){
        setTimeout(this.result.bind(this, ticket, data), 2000);
    }

    result(ticket, data){
        this.aa.notify({type: 'rpc', ticket: ticket, value: 1})
        this.mbx.notify({type: 'update', predicate: 'predicateA', ticket: 1, doc: data})
    }

}

export const ws = new wsActor()

