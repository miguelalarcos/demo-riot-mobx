import {expect} from 'chai'
import {mbx} from '../mobxActor.js'
import _ from 'lodash'

mbx.newCollection('collection')
mbx.register('predicateA', 'collection')

describe('test mbx', ()=>{
    it('test one insert', ()=> {
        mbx.notify({type: 'add', predicate: 'collection', doc: {a: 0}})
        expect(mbx.collections['collection'].values()).to.be.eql([{id: ':1', a: 0, tickets: new Set([1])}])
    });

    it('test one insert and rollback', ()=> {
        mbx.clear('collection')
        mbx.clearTicket()
        mbx.notify({type: 'add', predicate: 'collection', doc: {a: 0}})
        mbx.notify({type: 'rollback', id: 1})
        expect(mbx.collections['collection'].values()).to.be.eql([])
    });

    it('test one insert and ok', ()=> {
        mbx.clear('collection')
        mbx.clearTicket()
        mbx.notify({type: 'add', predicate: 'collection', doc: {a: 0}})
        mbx.notify({type: 'add', predicate: 'collection', ticket: 1, doc: {id: '0', a: 0}})
        expect(mbx.collections['collection'].values()).to.be.eql([{id: '0', a: 0, tickets: new Set([3])}])
    });

})