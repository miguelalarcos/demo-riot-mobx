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
  <my-doc></my-doc>

  <script>
    this.mixin(UImixin(this))
    this.subscribePredicate('predicateA', {a: 5})

    this.sortCmp = (a,b) => 1

  </script>
</app>
