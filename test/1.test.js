import {expect} from 'chai'
import {UImixin} from '../uiActor.js'
import _ from 'lodash'

class A{
    constructor(){
        this.items = []
    }
    sortCmp(a, b){
        if(a.a <= b.a)
            return 1
        return -1
    }
}

describe('test 1', ()=>{
    it('test empty', ()=>{
        let a = new A()
        let wr = UImixin(a)
        expect(a.items).to.be.empty
    })

    it('test insert', ()=>{
        let a = new A()
        let wr = UImixin(a)
        _.mixin(a, wr)
        a.updateItems({type: 'add', newValue: {a: 5}})
        expect(a.items).to.be.eql([{a: 5}])
    })

    it('test insert and delete', ()=>{
        let a = new A()
        let wr = UImixin(a)
        _.mixin(a, wr)

        a.updateItems({type: 'add', newValue: {id: '0', a: 5}})
        a.updateItems({type: 'delete', oldValue: {id: '0'}})
        expect(a.items).to.be.empty
    })

    it('test update', ()=>{
        let a = new A()
        let wr = UImixin(a)
        _.mixin(a, wr)

        a.updateItems({type: 'add', newValue: {id: '0', a: 5}})
        a.updateItems({type: 'update', newValue: {id: '0', a: 7}})
        expect(a.items).to.be.eql([{id: '0', a: 7}])
    })

    it('test order', ()=>{
        let a = new A()
        let wr = UImixin(a)
        _.mixin(a, wr)

        let c = {a:1}
        let d = {a:2}
        let e = {a:3}
        a.updateItems({type: 'add', newValue: e})
        a.updateItems({type: 'add', newValue: c})
        a.updateItems({type: 'add', newValue: d})

        expect(a.items).to.be.eql([c, d, e])
    })

})

