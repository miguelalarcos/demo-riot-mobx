import {UImixin} from './uiActor.js'

<app>
    <button onclick={click}>create random</button>
    <div each={items}>
        {a} <button onclick={delete}>delete</button>
    </div>

    <script>
        this.mixin(UImixin(this))
        this.subscribePredicate('predicateA')
        this.sortCmp = (a,b) => 1

        click(e){
            let data = {a: Math.random()}
            this.aa.rpc('add', 'collection', data)
        }

        delete(e){
            let id = e.item.id
            this.aa.rpc('delete', 'collection', id)
        }
    </script>
</app>