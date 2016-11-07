import {UImixin} from './uiActor.js'
import mobx from 'mobx'

<app>
    <div>Umbral: {umbral}</div>
    <button onclick={click}>create random</button>
    <div each={items}>
        {a} <button onclick={delete}>delete</button>
        <button onclick={plus1}>+1</button>
    </div>

    <script>
        this.mixin(UImixin(this))
        this.subscribePredicate('unique id', 'predicateA')
        this.sortCmp = (a,b) => 1

        let rv = mobx.Observable(0.5)
        this.link(rv, 'umbral')

        click(e){
            let data = {a: Math.random()}
            this.aa.rpc('add', 'collection', data)
        }

        delete(e){
            let id = e.item.id
            this.aa.rpc('delete', 'collection', id)
        }

        plus1(e){
            let item = e.item
            item.a += 1
            this.aa.rpc('update', 'collection', id, item)
        }

    </script>
</app>