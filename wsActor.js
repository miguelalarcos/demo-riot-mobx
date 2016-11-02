class wsActor{
    constructor(){
        this.mbx = null
        setTimeout(()=>this.setup, 5000);
    }
    setup(){
        this.mbx.notify({type: 'init', predicate: 'predicateA', ticket: 1})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'0', a: 0}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 2, doc: {id:'1', a: 1}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'2', a: 2}})

        this.mbx.notify({type: 'ready', predicate: 'predicateA', ticket: 1})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'3', a: 3}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 2, doc: {id:'4', a: 4}})
        this.mbx.notify({type: 'add', predicate: 'predicateA', ticket: 1, doc: {id:'5', a: 5}})
    }
}

export const ws = new wsActor()
