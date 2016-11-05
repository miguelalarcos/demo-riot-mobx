import {UImixin} from './uiActor.js'

<app>
    <button onclick={click}>create random</button>
    <div each={items}>
        {a}
    </div>

    <script>
        this.mixin(UImixin(this))
        this.subscribePredicate('predicateA')
        this.sortCmp = (a,b) => 1
        let data = {a: Math.random()}

        click(e){
            this.aa.rpc('add', 'collection', data)
        }
    </script>
</app>