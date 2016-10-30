<my-doc>
  <div>doc.a = {doc.a}</div>

  <script>
    import {UImixin} from './uiActor.js'

    this.mixin(UImixin(this))
    this.subscribeDoc('collection', '0')
  </script>
</my-doc>

<app>
  <div each={items}>
    {a}
  </div>
  <button onclick={onclick}>start</button>
  <my-doc></my-doc>

  <script>
    import {UImixin} from './uiActor.js'

    this.mixin(UImixin(this))
    this.subscribePredicate('predicateA', {a: 5})
  </script>
</app>
