import {UImixin} from './uiActor.js'
<my-doc>
    <div>doc.a = {doc.a}</div>
    <button onclick={click}>click</button>

    <script>
      this.mixin(UImixin(this))
      this.subscribeDoc('collection', '0')
      this.click = (e) => {
        this.mbx.update('collection', {id:'0', a: 700})
      }
    </script>
</my-doc>

<app>
  <div each={items}>
    {a}
  </div>
  <button onclick={onclick}>start</button>
  <my-doc></my-doc>

  <script>
    this.mixin(UImixin(this))
    this.subscribePredicate('predicateA', {a: 5})

    this.sortCmp = (a,b) => 1

    this.onclick = () => {
      let metadata = this.mbx.metadata

      metadata.set('collection:1', 'init')
      this.mbx.insert('collection', {id:'0', a: 0}, 1)
      this.mbx.insert('collection', {id:'1', a: 1}, 2)
      this.mbx.insert('collection', {id:'2', a: 2}, 1)

      metadata.set('collection:1', 'ready')
      this.mbx.insert('collection', {id:'3', a: 3}, 1)
      this.mbx.insert('collection', {id:'4', a: 4}, 2)
      this.mbx.insert('collection', {id:'5', a: 5}, 1)
    }

  </script>
</app>
